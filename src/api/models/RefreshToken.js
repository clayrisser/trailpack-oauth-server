import Model from 'trails/model';

export default class RefreshToken extends Model {
  static config(app, orm) {
    if (app) {
      const RefreshToken = require('./' + app.config.database.orm).RefreshToken;
      return new RefreshToken().config(app, orm);
    }
  }

  static schema(app, orm) {
    if (app) {
      const RefreshToken = require('./' + app.config.database.orm).RefreshToken;
      return new RefreshToken().schema(app, orm);
    }
  }
}
