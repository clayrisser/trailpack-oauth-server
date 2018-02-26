export default {
  ClientController: {
    create: ['OauthServer.isLoggedIn'],
    update: ['OauthServer.isLoggedIn'],
    destroy: ['OauthServer.isLoggedIn'],
    find: ['OauthServer.isLoggedIn'],
    findOne: ['OauthServer.isLoggedIn']
  },
  OauthController: {
    authenticate: [],
    authorize: [],
    token: []
  }
};
