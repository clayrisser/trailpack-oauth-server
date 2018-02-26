export default class User {
  static config(app) {
    return undefined;
  }

  static schema(app) {
    return {
      clients: {
        collection: 'Client',
        via: 'user'
      },
      authorizationCodes: {
        collection: 'AuthorizationCode',
        via: 'client'
      },
      toJSON: function toJSON() {
        return this.toObject();
      }
    };
  }
}
