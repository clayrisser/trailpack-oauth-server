export default [
  {
    method: 'POST',
    path: '/authenticate',
    handler: 'OauthController.authenticate'
  },
  {
    method: 'GET',
    path: '/authorize',
    handler: 'OauthController.authorize'
  },
  {
    method: 'POST',
    path: '/token',
    handler: 'OauthController.token'
  },
  {
    method: 'POST',
    path: '/register',
    handler: 'AuthController.register'
  },
  {
    method: 'POST',
    path: '/login',
    handler: 'AuthController.login'
  },
  {
    method: 'POST',
    path: '/client',
    handler: 'ClientController.create'
  }
];
