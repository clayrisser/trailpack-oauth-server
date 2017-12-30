export default [
  {
    method: 'GET',
    path: '/authenticate',
    handler: 'OauthController.authenticate'
  },
  {
    method: 'GET',
    path: '/authorize',
    handler: 'OauthController.authorize'
  },
  {
    method: 'GET',
    path: '/token',
    handler: 'OauthController.token'
  }
];
