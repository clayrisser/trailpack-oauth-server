export default class User {
  static config() {
    return undefined;
  }

  static schema() {
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
