import Service from 'trails/service';
import randomstring from 'randomstring';

export default class ClientService extends Service {

  create(token, { name, redirectUris }) {
    const o = this.app.orm;
    const s = this.app.services;
    return s.AuthService.findAuthed(token).then((user) => o.Client.create({
        name,
        redirectUris,
        user: user.id
      }).then((client) => client));
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
