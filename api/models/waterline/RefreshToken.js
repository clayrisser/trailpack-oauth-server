import dateFns from 'date-fns';

export default class RefreshToken {

  config(app) {
    return undefined;
  }

  schema(app) {
    return {
      token: {
        type: 'string',
        required: true
      },
      expires: {
        type: 'datetime',
        defaultsTo: dateFns.addDays(new Date(), 30)
      },
      scope: {
        type: 'string',
        required: true
      },
      client: {
        model: 'Client',
        required: true,
        via: 'refreshTokens'
      },
      user: {
        model: 'User',
        required: true,
        via: 'refreshTokens'
      }
    };
  }
}
