export default [
  {
    method: 'GET',
    path: '/oauth/authenticate',
    handler: 'OauthController.authenticate'
  },
  {
    method: 'GET',
    path: '/oauth/authorize',
    handler: 'OauthController.authorize'
  },
  {
    method: 'POST',
    path: '/oauth/token',
    handler: 'OauthController.token'
  },
  {
    method: 'POST',
    path: '/auth/register',
    handler: 'AuthController.register'
  },
  {
    method: 'POST',
    path: '/auth/login',
    handler: 'AuthController.login'
  },
  {
    method: 'POST',
    path: '/client',
    handler: 'ClientController.create'
  }
];
