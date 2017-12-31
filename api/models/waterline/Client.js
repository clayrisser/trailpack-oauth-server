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
      accessKey: {
        type: 'string',
        unique: true,
        defaultsTo: randomstring.generate(32)
      },
      secretKey: {
        type: 'string',
        defaultsTo: randomstring.generate(32)
      },
      redirectUris: {
        type: 'array',
        defaultsTo: ['http://example.com']
      },
      grants: {
        type: 'array',
        defaultsTo: [
          'password',
          'authorization_code',
          'refresh_token'
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
      refreshTokens: {
        collection: 'RefreshToken',
        via: 'client'
      },
      accessTokens: {
        collection: 'AccessToken',
        via: 'client'
      }
    };
  }
}
