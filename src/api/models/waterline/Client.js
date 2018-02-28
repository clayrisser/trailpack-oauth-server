import _ from 'lodash';

export default class Client {
  static config() {
    return undefined;
  }

  static schema() {
    return {
      name: {
        type: 'string',
        unique: true,
        required: true
      },
      key: {
        type: 'string',
        unique: true,
        defaultsTo: () => _.times(32, () => _.random(35).toString(36)).join('')
      },
      secret: {
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
      },
      toJSON: function toJSON() {
        const obj = this.toObject();
        _.assign(obj, {
          id: obj.key
        });
        delete obj.key;
        return obj;
      }
    };
  }
}
