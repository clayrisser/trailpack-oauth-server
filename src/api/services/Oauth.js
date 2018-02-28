import Service from 'trails/service';
import _ from 'lodash';
import boom from 'boom';
import jwt from 'jwt-simple';
import { addSeconds } from 'date-fns';

export default class Oauth extends Service {
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
      const payload = jwt.decode(token, c.oauth.jwtSecret);
      return !!payload.client;
    } catch (e) {
      if (e.message === 'Token expired') throw boom.unauthorized(e.message);
      throw e;
    }
  }

  generateAccessToken(client, user, scope) {
    const c = this.app.config;
    const payload = {
      clientId: client.clientId,
      exp: addSeconds(new Date(), c.oauth.accessTokenLifetime),
      iss: c.oauth.issuer,
      userId: user.id,
      scope
    };
    return jwt.encode(payload, c.oauth.jwtSecret);
  }

  generateRefreshToken(client, user, scope) {
    const c = this.app.config;
    const payload = {
      clientId: client.clientId,
      exp: addSeconds(new Date(), c.oauth.refreshTokenLifetime),
      iss: c.oauth.issuer,
      userId: user.id,
      scope
    };
    return jwt.encode(payload, c.oauth.jwtSecret);
  }

  async getAccessToken(token) {
    const c = this.app.config;
    const o = this.app.orm;
    try {
      const payload = jwt.decode(token, c.oauth.jwtSecret);
      return {
        accessToken: token,
        accessTokenExpiresAt: new Date(payload.exp),
        scope: payload.scope,
        user: await o.User.findOne(payload.userId).then(user =>
          user.toObject()
        ),
        client: await o.Client.findOne({ clientId: payload.clientId }).then(
          client => client.toObject()
        )
      };
    } catch (e) {
      if (e.message === 'Token expired') throw boom.unauthorized(e.message);
      throw e;
    }
  }

  async getAuthorizationCode(code) {
    const o = this.app.orm;
    const authorizationCode = await o.AuthorizationCode.findOne({
      code
    })
      .populate('client')
      .populate('user');
    return {
      code: authorizationCode.code,
      expiresAt: authorizationCode.expires,
      redirectUri: authorizationCode.redirectUri,
      scope: authorizationCode.scope,
      client: authorizationCode.client.toObject(),
      user: authorizationCode.user.toObject()
    };
  }

  async getClient(clientId, clientSecret) {
    const o = this.app.orm;
    const query = { clientId };
    if (clientSecret) query.clientSecret = clientSecret;
    return o.Client.findOne(query).then(client => client.toObject());
  }

  async getRefreshToken(token) {
    const c = this.app.config;
    const o = this.app.orm;
    try {
      const payload = jwt.decode(token, c.oauth.jwtSecret);
      return {
        refreshToken: token,
        refreshTokenExpiresAt: new Date(payload.exp),
        scope: payload.scope,
        user: await o.User.findOne(payload.userId).then(user =>
          user.toObject()
        ),
        client: await o.Client.findOne({ clientId: payload.clientId }).then(
          client => client.toObject()
        )
      };
    } catch (e) {
      if (e.message === 'Token expired') throw boom.unauthorized(e.message);
      throw e;
    }
  }

  async getUser(username, password) {
    const c = this.app.config;
    const s = this.app.services;
    return _.get(s, c.oauth.handleGetUser)(username, password);
  }

  async handleGetUser(username, password) {
    const o = this.app.orm;
    const user = await o.User.findOne({ username });
    if (!user.validatePassword(password))
      throw boom.badRequest('invalid password');
    return user.toObject();
  }

  async getUserFromClient(client) {
    const o = this.app.orm;
    const { user } = await o.Client.findOne({
      clientId: client.clientId
    }).populate('user');
    return user.toObject();
  }

  async revokeAuthorizationCode(code) {
    const o = this.app.orm;
    return !!await o.AuthorizationCode.destroy({ code });
  }

  async revokeToken() {
    return true;
  }

  async saveAuthorizationCode(code, client, user) {
    const o = this.app.orm;
    const authorizationCode = await o.AuthorizationCode.create({
      code: code.authorizationCode,
      expires: code.expiresAt,
      redirectUri: code.redirectUri,
      scope: code.scope,
      client: client.id,
      user: user.id
    }).then(authorizationCode =>
      o.AuthorizationCode.findOne(authorizationCode.id)
        .populate('client')
        .populate('user')
    );
    return {
      authorizationCode: authorizationCode.code,
      expiresAt: authorizationCode.expires,
      redirectUri: authorizationCode.redirectUri,
      scope: authorizationCode.scope,
      client: authorizationCode.client.toObject(),
      user: authorizationCode.user.toObject()
    };
  }

  async saveToken(token, client, user) {
    token.client = client;
    token.user = user;
    return token;
  }

  async validateScope(user, client, scope) {
    const c = this.app.config;
    if (scope) {
      return scope
        .split(' ')
        .filter(s => c.oauth.scopes.indexOf(s) >= 0)
        .join(' ');
    }
    return c.oauth.scopes.join(' ');
  }

  async verifyScope(token, scope) {
    if (!token.scope) return false;
    const requestedScopes = scope.split(' ');
    const authorizedScopes = token.scope.split(' ');
    return requestedScopes.every(s => authorizedScopes.indexOf(s) >= 0);
  }
}
