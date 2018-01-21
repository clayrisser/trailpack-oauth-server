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

      setPassword: function setPassword(password) {
        this.passwordHash = bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
        return this.passwordHash;
      },

      validatePassword: function validatePassword(password) {
        if (!this.passwordHash) throw boom.badRequest('Password not set');
        return bCrypt.compareSync(password, this.passwordHash);
      },

      toJSON: function toJSON() {
        const obj = this.toObject();
        if (obj.passwordHash) delete obj.passwordHash;
        return obj;
      }
    };
  }
}
