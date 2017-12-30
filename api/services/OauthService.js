import Service from 'trails/service';
import boom from 'boom';
import dateFns from 'date-fns';
import _ from 'lodash';

export default class OauthService extends Service {

  getAccessToken(token) {
    const o = this.app.orm;
    return o.AccessToken.findOne({ token: token })
      .populate('client')
      .populate('user')
      .then((accessToken) => {
        const client = _.clone(accessToken.client);
        client.id = client.accessKey;
        return {
          accessToken: accessToken.token,
          accessTokenExpiresAt: accessToken.expires,
          scope: accessToken.scope,
          client: client,
          user: accessToken.user
        };
      });
  }

  getAuthorizationCode(code) {
    const o = this.app.orm;
    return o.AuthorizationCode.findOne({ code: code })
      .populate('client')
      .populate('user')
      .then((authorizationCode) => {
        const client = _.clone(authorizationCode.client);
        client.id = client.accessKey;
        return {
          code: authorizationCode.code,
          expiresAt: authorizationCode.expires,
          redirectUri: authorizationCode.redirectUri,
          scope: authorizationCode.scope,
          client: client,
          user: authorizationCode.user
        };
      });
  }

  getClient(accessKey, secretKey) {
    const o = this.app.orm;
    let query = { id: accessKey };
    if (secretKey) {
      query = {
        accessKey,
        secretKey
      }
    }
    return o.Client.findOne(query).then((client) => {
      client.id = client.accessKey;
      return client;
    });
  }

  getRefreshToken(token) {
    const o = this.app.orm;
    return o.RefreshToken.findOne({ token: token })
      .populate('client')
      .populate('user')
      .then((refreshToken) => {
        const client = _.clone(refreshToken.client);
        client.id = client.accessKey;
        return {
          refreshToken: refreshToken.token,
          refreshTokenExpiresAt: refreshToken.expires,
          scope: refreshToken.scope,
          client: client,
          user: refreshToken.user
        };
      });
  }

  getUser(username, password) {
    const o = this.app.orm;
    return o.User.findOne({ username: username }).then((user) => {
      if (!user.validatePassword(password)) throw boom.badRequest('Invalid password');
      return user;
    });
  }

  getUserFromClient(client) {
    const o = this.app.orm;
    return o.Client.findOne({ accessKey: client.accessKey }).then((client) => {
      return o.User.findOne({ id: client.id }).then((user) => {
        return user;
      });
    });
  }

  revokeAuthorizationCode(code) {
    const o = this.app.orm;
    return o.AuthorizationCode.destroy({ code: code }).then((authorizationCode) => {
      return !!authorizationCode;
    });
  }

  revokeToken(token) {
    const o = this.app.orm;
    return o.RefreshToken.destroy({ token: token }).then((revokeToken) => {
      return !!refreshToken;
    });
  }

  saveAuthorizationCode(code, client, user) {
    const o = this.app.orm;
    return o.Client.findOne({ accessKey: client.id }).then((client) => {
      return o.AuthorizationCode.create({
        code: code.authorizationCode,
        expires: code.expiresAt,
        redirectUri: code.redirectUri,
        scope: code.scope,
        client: client.id,
        user: user.id
      });
    });
  }

  saveToken(token, client, user) {
    const o = this.app.orm;
    return o.Client.findOne({ accessKey: client.id }).then((client) => {
      const promises = [
        o.AccessToken.create({
          token: token.accessToken,
          expires: token.accessTokenExpiresAt,
          scope: token.scope,
          client: client.id,
          user: user.id
        }).populate('client').populate('user'),
        o.RefreshToken.create({
          token: token.refreshToken,
          expires: token.refreshTokenExpiresAt,
          scope: token.scope,
          client: client.id,
          user: user.id
        })
      ];
      return Promise.all(promises).then((results) => {
        const accessToken = results[0];
        const refreshToken = results[1];
        return {
          accessToken: accessToken.token,
          accessTokenExpiresAt: accessToken.expires,
          refreshToken: refreshToken.token,
          refreshTokenExpiresAt: refreshToken.expires,
          scope: accessToken.scope,
          client: accessToken.client,
          user: accessToken.user
        };
      });
    });
  }

  validateScope(user, client, scope) {
    const o = this.app.orm;
    return o.Client.findOne({ accessKey: client.id }).then((client) => {
      return true;
    });
  }

  verifyScope(token, scope) {
    if (!token.scope) return false;
    const requestedScopes = scope.split(' ');
    const authorizedScopes = token.scope.split(' ');
    return requestedScopes.every(s => authorizedScopes.indexOf(s) >= 0);
  }
}
