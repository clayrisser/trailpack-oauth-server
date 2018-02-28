import Service from 'trails/service';

export default class Client extends Service {
  create(userId, payload) {
    const o = this.app.orm;
    return o.Client.create({
      ...payload,
      user: userId
    });
  }

  update(userId, clientId, payload) {
    const o = this.app.orm;
    return o.Client.update({ id: clientId, user: userId }, payload);
  }

  findOne(userId, clientId) {
    const o = this.app.orm;
    return o.Client.findOne({ id: clientId, user: userId });
  }

  find(userId, payload) {
    payload = {
      ...payload,
      user: userId
    };
    const o = this.app.orm;
    return o.Client.find(payload);
  }

  destroy(userId, clientId) {
    const o = this.app.orm;
    return o.Client.destroy({ id: clientId, user: userId });
  }
}
