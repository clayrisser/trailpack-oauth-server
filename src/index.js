import Trailpack from 'trailpack';
import _ from 'lodash';
import OAuth2Server from 'oauth2-server';
import models from './api/models';

export default class OauthTrailpack extends Trailpack {

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
    this.mergedModels();
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

  mergedModels() {
    _.each(models, (model, key) => {
      if (this.app.models[key]) {
        const Model = _.clone(this.app.models[key]);
        if (models[key].config) {
          const oauthConfig = models[key].config(this.app);
          const defaultConfig = this.app.models[key].constructor.config(this.app);
          this.app.models[key].constructor.config = (app) => _.assign({}, oauthConfig, defaultConfig);
        }
        if (models[key].schema) {
          const oauthSchema = models[key].schema(this.app);
          const defaultSchema = this.app.models[key].constructor.schema(this.app);
          this.app.models[key].constructor.schema = (app) => _.assign({}, oauthSchema, defaultSchema);
        }
      } else {
        this.app.models[key] = { constructor: models[key] };
      }
    });
  }
};
