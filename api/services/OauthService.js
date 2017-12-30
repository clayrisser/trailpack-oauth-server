const Service = require('trails/service');
const dateFns = require('date-fns');

module.exports = class OauthService extends Service {

  getAccessToken(token) {
    const o = this.app.orm;
    return o.AccessToken.findOne({ token: token })
      .populate('client')
      .populate('user')
      .then((accessToken) => {
        return {
          accessToken: accessToken.token,
          accessTokenExpiresAt: accessToken.expires,
          scope: accessToken.scope,
          client: accessToken.client,
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
        return {
          code: authorizationCode.code,
          expiresAt: authorizationCode.expires,
          redirectUri: authorizationCode.redirectUri,
          scope: authorizationCode.scope,
          client: authorizationCode.client,
          user: authorizationCode.user
        };
      });
  }

  getClient(clientId, secret) {
    const o = this.app.orm;
    const query = { id: clientId };
    if (secret) query.secret = secret;
    return o.Client.findOne(query)
      .then((client) => {
        return {
          id: client.id,
          redirectUris: client.redirectUris,
          grants: client.grants
        };
      });
  }

  getRefreshToken(token) {
    const o = this.app.orm;
    return o.AccessToken.findOne({ token: token })
      .populate('client')
      .populate('user')
      .then((refreshToken) => {
        return {
          refreshToken: refreshToken.token,
          refreshTokenExpiresAt: refreshToken.expires,
          scope: refreshToken.scope,
          client: refreshToken.client,
          user: refreshToken.user
        };
      });
  }

  getUser(username, password) {

  }

  getUserFromClient(client) {
    const o = this.app.orm;
    return o.User.findOne({ id: client.user_id }).then((user) => {
      return user;
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
    return o.AuthorizationCode.create({
      code: code.authorization_code,
      expires: dateFns.addDays(new Date(), 30),
      redirectUri: code.redirect_uri,
      scope: code.scope,
      client: client.client_id,
      user: user.user_id
    });
  }

  saveToken(token, client, user) {
    const o = this.app.orm;
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
    return Promise.all(promises).spread((accessToken, refreshToken) => {
      return {
        accessToken: accessToken.token,
        accessTokenExpiresAt: accessToken.expires,
        refreshToken: refreshToken.token,
        refreshTokenExpiresAt: refreshToken.expires,
        scope: accessToken.scope,
        client: { id: accessToken.client.id },
        user: { id: accessToken.user.id }
      };
    });
  }

  validateScope(user, client, scope) {
    return true;
  }

  verifyScope(token, scope) {
    if (!token.scope) return false;
    const requestedScopes = scope.split(' ');
    const authorizedScopes = token.scope.split(' ');
    return requestedScopes.every(s => authorizedScopes.indexOf(s) >= 0);
  }
};
