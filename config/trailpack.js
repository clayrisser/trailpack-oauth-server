export default {
  provides: {
    api: {
      controllers: ['OauthController'],
      services: ['OauthService']
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
