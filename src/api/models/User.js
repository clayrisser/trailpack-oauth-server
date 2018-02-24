import Model from 'trails/model';

export default class User extends Model {
  static config(app, orm) {
    if (app) {
      const User = require(`./${  app.config.database.orm}`).User;
      return new User().config(app, orm);
    }
  }

  static schema(app, orm) {
    if (app) {
      const User = require(`./${  app.config.database.orm}`).User;
      return new User().schema(app, orm);
    }
  }
}
