import Service from 'trails/service';

export default class UserService extends Service {

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
}
