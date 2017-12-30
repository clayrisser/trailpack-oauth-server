module.exports = {

  config: (app) => {
    return undefined
  },

  schema: (app) => {
    return {
      token: {
        type: 'string',
        required: true
      },
      expires: {
        type: 'datetime',
        required: true
      },
      scope: {
        type: 'string',
        required: true
      },
      client: {
        model: 'Client',
        required: true,
        via: 'accessTokens'
      },
      user: {
        model: 'User',
        required: true,
        via: 'accessTokens'
      }
    }
  }
};
