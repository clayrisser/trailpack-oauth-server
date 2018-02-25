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
      throw new Error('This Trailpack work only for express');
    }
    if (!_.includes(_.keys(this.app.packs), 'waterline')) {
      throw new Error('This Trailpack only works with waterline');
    }
  }

  configure() {
    const s = this.app.services;
    const c = this.app.config;
    this.app.oauth = new OAuth2Server({
      model: s.OauthService.getModel(),
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
