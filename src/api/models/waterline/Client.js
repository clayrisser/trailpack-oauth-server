import randomstring from 'randomstring';

export default class Client {
  config(app) {
    return undefined;
  }

  schema(app) {
    return {
      name: {
        type: 'string',
        unique: true,
        required: true
      },
      key: {
        type: 'string',
        unique: true,
        defaultsTo: randomstring.generate(32)
      },
      secret: {
        type: 'string',
        defaultsTo: randomstring.generate(32)
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
        obj.id = obj.key;
        delete obj.key;
        return obj;
      }
    };
  }
}
