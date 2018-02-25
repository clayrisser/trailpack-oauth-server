import Model from 'trails/model';

export default class User extends Model {
  static config(app, orm) {
    if (!app) throw new Error("'app' not defined");
    const { User } = require(`./${app.config.database.orm}`).default;
    return User.config(app, orm);
  }

  static schema(app, orm) {
    if (!app) throw new Error("'app' not defined");
    const { User } = require(`./${app.config.database.orm}`).default;
    return User.schema(app, orm);
  }
}
