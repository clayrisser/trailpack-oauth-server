module.exports = {

  config: (app) => {
    return undefined
  },

  schema: (app) => {
    return {
      code: {
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
      redirectUrl: {
        type: 'string',
        required: true
      },
      client: {
        model: 'Client',
        required: true,
        via: 'authorizationCodes'
      },
      user: {
        model: 'User',
        required: true,
        via: 'authorizationCodes'
      }
    }
  }
};
