module.exports = {

  config: app => {
    return undefined
  },

  schema: app => {
    return {
      name: {
        type: 'string',
        unique: true,
        required: true
      },
      secret: {
        type: 'string',
        required: true
      },
      redirectUris: {
        type: 'array',
        defaultsTo: []
      },
      grants: {
        type: 'array',
        defaultsTo: []
      },
      user: {
        model: 'User',
        required: true,
        via: 'clients'
      }
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
