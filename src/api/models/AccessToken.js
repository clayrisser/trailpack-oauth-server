import Model from 'trails/model';

export default class AccessToken extends Model {

  static config(app, orm) {
    if (app) {
      const AccessToken = require('./' + app.config.database.orm).AccessToken;
      return new AccessToken().config(app, orm);
    }
  }

  static schema(app, orm) {
    if (app) {
      const AccessToken = require('./' + app.config.database.orm).AccessToken;
      return new AccessToken().schema(app, orm);
    }
  }
}
