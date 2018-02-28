import Service from 'trails/service';
import _ from 'lodash';
import boom from 'boom';

export default class Client extends Service {
  async create(userId, payload) {
    const o = this.app.orm;
    return o.Client.create({
      ...payload,
      user: userId
    });
  }

  async update(userId, clientId, payload) {
    const o = this.app.orm;
    const clients = await o.Client.update(
      { id: clientId, user: userId },
      payload
    );
    const client = _.get(clients, '0');
    if (!client) throw boom.notFound('client not found');
    return client;
  }

  async findOne(userId, clientId) {
    const o = this.app.orm;
    const client = await o.Client.findOne({ id: clientId, user: userId });
    if (!client) throw boom.notFound('client not found');
    return client;
  }

  async find(userId, payload) {
    payload = {
      ...payload,
      user: userId
    };
    const o = this.app.orm;
    return o.Client.find(payload);
  }

  async destroy(userId, clientId) {
    const o = this.app.orm;
    return o.Client.destroy({ id: clientId, user: userId });
  }
}
