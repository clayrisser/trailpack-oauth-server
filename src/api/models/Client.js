import Model from 'trails/model';

export default class Client extends Model {
  static config(app, orm) {
    if (!app) throw new Error("'app' not defined");
    const { Client } = require(`./${app.config.database.orm}`).default;
    return Client.config(app, orm);
  }

  static schema(app, orm) {
    if (!app) throw new Error("'app' not defined");
    const { Client } = require(`./${app.config.database.orm}`).default;
    return Client.schema(app, orm);
  }
}
