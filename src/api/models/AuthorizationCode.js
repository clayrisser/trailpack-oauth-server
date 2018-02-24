import Model from 'trails/model';

export default class AuthorizationCode extends Model {
  static config(app, orm) {
    if (app) {
      const AuthorizationCode = require(`./${  app.config.database.orm}`).AuthorizationCode;
      return new AuthorizationCode().config(app, orm)
    }
  }

  static schema(app, orm) {
    if (app) {
      const AuthorizationCode = require(`./${  app.config.database.orm}`).AuthorizationCode;
      return new AuthorizationCode().schema(app, orm)
    }
  }
}
