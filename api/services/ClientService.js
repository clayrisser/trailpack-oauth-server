import Service from 'trails/service';
import randomstring from 'randomstring';

export default class ClientService extends Service {

  create({ name, userId }) {
    const o = this.app.orm;
    return o.Client.create({
      name: name,
      user: userId
    }).then((client) => {
      return client;
    });
  }

  update(clientId, properties) {
    return o.Client.update(clientId, properties);
  }

  findOne(clientId) {
    return o.Client.findOne(clientId);
  }

  find() {
    return o.Client.find();
  }

  destroy(clientId) {
    return o.Client.destroy(clientId)
  }
}
