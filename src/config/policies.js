export default {
  Client: {
    create: ['OauthServer.isLoggedIn'],
    update: ['OauthServer.isLoggedIn'],
    destroy: ['OauthServer.isLoggedIn'],
    find: ['OauthServer.isLoggedIn'],
    findOne: ['OauthServer.isLoggedIn']
  },
  Oauth: {
    authenticate: [],
    authorize: [],
    token: []
  }
};
