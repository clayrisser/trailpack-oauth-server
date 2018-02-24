import Service from 'trails/service';

export default class UserService extends Service {
  update(userId, properties) {
    const o = this.app.orm;
    return o.User.update(userId, properties);
  }

  findOne(userId) {
    const o = this.app.orm;
    return o.User.findOne(userId);
  }

  find() {
    const o = this.app.orm;
    return o.User.find();
  }

  destroy(userId) {
    const o = this.app.orm;
    return o.User.destroy(userId);
  }
}
