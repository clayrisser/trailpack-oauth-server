import Service from 'trails/service';
import _ from 'lodash';
import boom from 'boom';
import jwt from 'jwt-simple';
import { addSeconds } from 'date-fns';

export default class OauthService extends Service {

  getModel() {
    return {
      generateAccessToken: this.generateAccessToken,
      generateRefreshToken: this.generateRefreshToken,
      getAccessToken: this.getAccessToken,
      getAuthorizationCode: this.getAuthorizationCode,
      getClient: this.getClient,
      getRefreshToken: this.getRefreshToken,
      getUser: this.getUser,
      getUserFromClient: this.getUserFromClient,
      revokeAuthorizationCode: this.revokeAuthorizationCode,
      revokeToken: this.revokeToken,
      saveAuthorizationCode: this.saveAuthorizationCode,
      saveToken: this.saveToken,
      validateScope: this.validateScope,
      verifyScope: this.verifyScope
    };
  }

  isOauthToken(token) {
    const c = this.app.config;
    try {
      const payload = jwt.decode(token, c.oauth.jwt.secret);
      return !!payload.client;
    } catch(e) {
      if (e.message === 'Token expired') throw boom.unauthorized(e.message);
      throw e;
    }
  }

  generateAccessToken(client, user, scope) {
    const c = this.app.config;
    const payload = {
      clientId: client.id,
      exp: addSeconds(new Date(), c.oauth.jwt.accessTokenExp),
      iss: c.oauth.jwt.iss,
      userId: user.id,
      scope
    };
    return jwt.encode(payload, c.oauth.jwt.secret);
  }

  generateRefreshToken(client, user, scope) {
    const c = this.app.config;
    const payload = {
      clientId: client.id,
      exp: addSeconds(new Date(), c.oauth.jwt.refreshTokenExp),
      iss: c.oauth.jwt.iss,
      userId: user.id,
      scope
    };
    return jwt.encode(payload, c.oauth.jwt.secret);
  }

  async getAccessToken(token) {
    const c = this.app.config;
    const o = this.app.orm;
    try {
      const payload = jwt.decode(token, c.oauth.jwt.secret);
      return {
        accessToken: token,
        accessTokenExpiresAt: new Date(payload.exp),
        scope: payload.scope,
        user: await o.User.findOne(payload.userId).then(user => user.toJSON()),
        client: await o.Client.findOne({ key: payload.clientId }).then(client => client.toJSON())
      };
    } catch(e) {
      if (e.message === 'Token expired') throw boom.unauthorized(e.message);
      throw e;
    }
  }

  async getAuthorizationCode(code) {
    const o = this.app.orm;
    const authorizationCode = await o.AuthorizationCode.findOne({
      code
    }).populate('client').populate('user');
    return {
      code: authorizationCode.code,
      expiresAt: authorizationCode.expires,
      redirectUri: authorizationCode.redirectUri,
      scope: authorizationCode.scope,
      client: authorizationCode.client.toJSON(),
      user: authorizationCode.user.toJSON()
    };
  }

  async getClient(clientId, clientSecret) {
    const o = this.app.orm;
    let query = { key: clientId };
    if (clientSecret) query.secret = clientSecret;
    return o.Client.findOne(query).then(client => client.toJSON());
  }

  async getRefreshToken(token) {
    const c = this.app.config;
    const o = this.app.orm;
    try {
      const payload = jwt.decode(token, c.oauth.jwt.secret);
      return {
        refreshToken: token,
        refreshTokenExpiresAt: new Date(payload.exp),
        scope: payload.scope,
        user: await o.User.findOne(payload.userId).then(user => user.toJSON()),
        client: await o.Client.findOne({ key: payload.clientId }).then(client => client.toJSON())
      };
    } catch(e) {
      if (e.message === 'Token expired') throw boom.unauthorized(e.message);
      throw e;
    }
  }

  async getUser(username, password) {
    const o = this.app.orm;
    const user = await o.User.findOne({ username });
    if (!user.validatePassword(password)) throw boom.badRequest('Invalid password');
    return user.toJSON();
  }

  async getUserFromClient(client) {
    const o = this.app.orm;
    const { user } = await o.Client.findOne({ key: client.id }).populate('user');
    return user.toJSON();
  }

  async revokeAuthorizationCode(code) {
    const o = this.app.orm;
    return !!(await o.AuthorizationCode.destroy({ code }));
  }

  async revokeToken(token) {
    return true;
  }

  async saveAuthorizationCode(code, client, user) {
    const o = this.app.orm;
    const authorizationCode = await o.AuthorizationCode.create({
      code: code.authorizationCode,
      expires: code.expiresAt,
      redirectUri: code.redirectUri,
      scope: code.scope,
      client: await o.Client.findOne({ key: client.id }).then(client => client.id),
      user: user.id
    }).then((authorizationCode) => {
      return o.AuthorizationCode.findOne(authorizationCode.id).populate('client').populate('user');
    });
    return {
      authorizationCode: authorizationCode.code,
      expiresAt: authorizationCode.expires,
      redirectUri: authorizationCode.redirectUri,
      scope: authorizationCode.scope,
      client: authorizationCode.client.toJSON(),
      user: authorizationCode.user.toJSON()
    };
  }

  async saveToken(token, client, user) {
    token.client = client;
    token.user = user;
    return token;
  }

  async validateScope(user, client, scope) {
    const o = this.app.orm;
    const c = this.app.config;
    if (scope) {
      return scope.split(' ').filter(s => c.oauth.scopes.indexOf(s) >= 0).join(' ');
    }
    return false;
  }

  async verifyScope(token, scope) {
    if (!token.scope) return false;
    const requestedScopes = scope.split(' ');
    const authorizedScopes = token.scope.split(' ');
    return requestedScopes.every(s => authorizedScopes.indexOf(s) >= 0);
  }
}
