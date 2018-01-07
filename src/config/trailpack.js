export default {
  provides: {
    api: {
      controllers: [
        'AuthController',
        'ClientController',
        'OauthController',
        'UserController'
      ],
      services: [
        'AuthService',
        'ClientService',
        'OauthService',
        'UserService'
      ]
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
