const Service = require('trails/service');

module.exports = class UserService extends Service {

  create({ username, password }) {
    const o = this.app.orm;
    return o.Client.create({
      username: username
    }).then((user) => {
      return new Promise((resolve, reject) => {
        user.setPassword(password);
        user.save((err) => {
          if (err) return reject(err);
          return resolve(user);
        });
      });
    });
  }

  update(userId, properties) {
    return o.User.update(userId, properties);
  }

  findOne(userId) {
    return o.User.findOne(userId);
  }

  find() {
    return o.User.find();
  }

  destroy(userId) {
    return o.User.destroy(userId)
  }
};
