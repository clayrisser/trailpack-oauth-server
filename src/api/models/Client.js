import Model from 'trails/model';

export default class Client extends Model {
  static config(app, orm) {
    if (app) {
      const Client = require('./' + app.config.database.orm).Client;
      return new Client().config(app, orm);
    }
  }

  static schema(app, orm) {
    if (app) {
      const Client = require('./' + app.config.database.orm).Client;
      return new Client().schema(app, orm);
    }
  }
}
