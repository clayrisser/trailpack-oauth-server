export default {
  accessTokenLifetime: 3600,

  addAcceptedScopesHeader: true,

  addAuthorizedScopesHeader: true,

  allowBearerTokensInQueryString: false,

  allowEmptyState: false,

  allowExtendedTokenAttributes: false,

  authorizationCodeLifetime: 300,

  issuer: 'oauth',

  jwtSecret: 'some-jwt-secret',

  refreshTokenLifetime: 1209600,

  requireClientAuthentication: true,

  scopes: ['read', 'write'],

  prefix: '/',

  handleGetUser: 'Oauth.handleGetUser',

  userSession: 'user',

  oauthSession: 'oauth'
};
