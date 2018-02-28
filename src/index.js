import Trailpack from 'trailpack';
import _ from 'lodash';
import OAuth2Server from 'oauth2-server';
import models from './api/models';
import config from './config';
import pkg from './pkg';
import api from './api';

module.exports = class OauthTrailpack extends Trailpack {
  constructor(app) {
    super(app, {
      config,
      pkg,
      api
    });
  }

  async validate() {
    if (!_.includes(_.keys(this.app.packs), 'express')) {
      throw new Error("This Trailpack requires 'trailpack-express'");
    }
    if (!_.includes(_.keys(this.app.packs), 'waterline')) {
      throw new Error("This Trailpack requires 'trailpack-waterline'");
    }
  }

  configure() {
    const c = this.app.config;
    if (c.oauth.prefix) {
      this.prefixRoutes();
    }
  }

  initialize() {
    const c = this.app.config;
    const s = this.app.services;
    this.app.oauth = new OAuth2Server({
      model: s.Oauth.getModel(),
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

  prefixRoutes() {
    const c = this.app.config;
    _.each(config.routes, oauthRoute => {
      _.remove(c.routes, route => route.path === oauthRoute.path);
      oauthRoute.path = (c.oauth.prefix + oauthRoute.path).replace('//', '/');
      c.routes.push(oauthRoute);
    });
  }
};
