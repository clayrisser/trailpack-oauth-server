import _ from 'lodash';
import boom from 'boom';

export default class Client {
  static config(app) {
    return {
      async beforeValidate(payload, next) {
        const o = app.orm;
        const client = await o.Client.findOne({
          name: payload.name
        });
        if (client) {
          return next(
            boom.badRequest(`"name" '${payload.name}' already registered`, {
              name: payload.name
            })
          );
        }
        return next();
      }
    };
  }

  static schema() {
    return {
      name: {
        type: 'string',
        unique: true,
        required: true
      },
      clientId: {
        type: 'string',
        unique: true,
        defaultsTo: () => _.times(32, () => _.random(35).toString(36)).join('')
      },
      clientSecret: {
        type: 'string',
        defaultsTo: () => _.times(32, () => _.random(35).toString(36)).join('')
      },
      redirectUris: {
        type: 'array',
        required: true
      },
      grants: {
        type: 'array',
        defaultsTo: [
          'password',
          'authorization_code',
          'refresh_token',
          'client_credentials'
        ]
      },
      user: {
        model: 'User',
        required: true,
        via: 'clients'
      },
      authorizationCodes: {
        collection: 'AuthorizationCode',
        via: 'client'
      }
    };
  }
}
