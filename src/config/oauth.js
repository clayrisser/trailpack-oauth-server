export default {

  addAcceptedScopesHeader: true,

  addAuthorizedScopesHeader: true,

  allowBearerTokensInQueryString: false,

  allowEmptyState: false,

  authorizationCodeLifetime: 300,

  accessTokenLifetime: 3600,

  refreshTokenLifetime: 1209600,

  allowExtendedTokenAttributes: false,

  requireClientAuthentication: true,

  jwt: {
    secret: 'some-jwt-secret',
    iss: 'oauth',
    accessTokenExp: 1800, // 30 minutes
    refreshTokenExp: 1209600
  }
};
