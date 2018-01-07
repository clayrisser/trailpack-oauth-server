import bCrypt from 'bcrypt-nodejs';

export default class User {

  config(app) {
    return undefined;
  }

  schema(app) {
    return {
      username: {
        type: 'string',
        unique: true,
        required: true
      },
      passwordHash: {
        type: 'string'
      },
      clients: {
        collection: 'Client',
        via: 'user'
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
      },

      setPassword: function setPassword(password) {
        this.passwordHash = bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
        return this.passwordHash;
      },

      validatePassword: function validatePassword(password) {
        if (!this.passwordHash) throw boom.badRequest('Password not set');
        return bCrypt.compareSync(password, this.passwordHash);
      }
    };
  }
}
