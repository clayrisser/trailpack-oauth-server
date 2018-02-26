export default {
  provides: {
    api: {
      controllers: [
        'AuthController',
        'ClientController',
        'OauthController',
        'UserController'
      ],
      services: ['ClientService', 'OauthService']
    },
    config: []
  },
  lifecycle: {
    configure: {
      listen: [],
      emit: []
    },
    initialize: {
      listen: [],
      emit: []
    }
  }
};
