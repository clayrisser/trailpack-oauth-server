module.exports = {

  config: app => {
    return undefined
  },

  schema: app => {
    return {
      username: {
        type: 'string',
        unique: true,
        required: true
      },
      clients: {
        collection: 'Client',
        via: 'user'
      },
      authorizationCodes: {
        collection: 'AuthorizationCode',
        via: 'client'
      },
      refreshTokens: {
        collection: 'RefreshToken',
        via: 'client'
      },
      accessTokens: {
        collection: 'AccessToken',
        via: 'client'
      }
    }
  }
};
