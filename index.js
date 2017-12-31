import Trailpack from 'trailpack';
import _ from 'lodash';
import OAuth2Server from 'oauth2-server';

module.exports = class OauthTrailpack extends Trailpack {

  constructor(app) {
    super(app, {
      config: require('./config'),
      api: require('./api'),
      pkg: require('./package')
    });
  }

  validate() {
    if (!_.includes(_.keys(this.app.packs), 'express')) {
      return Promise.reject(new Error('This Trailpack work only for express'));
    }
    if (!_.includes(_.keys(this.app.packs), 'waterline')) {
      return Promise.reject(new Error('This Trailpack only works with waterline'));
    }
    return Promise.resolve();
  }

  configure() {
    const s = this.app.services;
    const c = this.app.config;
    this.app.oauth = new OAuth2Server({
      model: {
        getAccessToken: s.OauthService.getAccessToken,
        getAuthorizationCode: s.OauthService.getAuthorizationCode,
        getClient: s.OauthService.getClient,
        getRefreshToken: s.OauthService.getRefreshToken,
        getUser: s.OauthService.getUser,
        getUserFromClient: s.OauthService.getUserFromClient,
        revokeAuthorizationCode: s.OauthService.revokeAuthorizationCode,
        revokeToken: s.OauthService.revokeToken,
        saveAuthorizationCode: s.OauthService.saveAuthorizationCode,
        saveToken: s.OauthService.saveToken,
        validateScope: s.OauthService.validateScope,
        verifyScope: s.OauthService.verifyScope
      },
      addAcceptedScopesHeader: c.oauth.addAcceptedScopesHeader,
      addAuthorizedScopesHeader: c.oauth.addAuthorizedScopesHeader,
      allowBearerTokensInQueryString: c.oauth.allowBearerTokensInQueryString,
      allowEmptyState: c.oauth.allowEmptyState,
      authorizationCodeLifetime: c.oauth.authorizationCodeLifetime,
      accessTokenLifetime: c.oauth.accessTokenLifetime,
      refreshTokenLifetime: c.oauth.refreshTokenLifetime,
      allowExtendedTokenAttributes: c.oauth.allowExtendedTokenAttributes,
      requireClientAuthentication: c.oauth.requireClientAuthentication
    });
  }
};
