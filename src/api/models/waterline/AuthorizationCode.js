import dateFns from 'date-fns';

export default class AuthorizationCode {
  static config(app) {
    return undefined;
  }

  static schema(app) {
    return {
      code: {
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
      redirectUri: {
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
    };
  }
}
