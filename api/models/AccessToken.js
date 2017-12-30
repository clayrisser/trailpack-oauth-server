const Model = require('trails/model')

module.exports = class User extends Model {
  static config(app, orm) {
    if (app) {
      return require('./' + app.config.database.orm).AccessToken.config(app, orm)
    }
  }

  static schema(app, orm) {
    if (app) {
      return require('./' + app.config.database.orm).AccessToken.schema(app, orm)
    }
  }
}
