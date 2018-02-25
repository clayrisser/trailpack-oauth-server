import Service from 'trails/service';

export default class ClientService extends Service {
  create(token, { name, redirectUris }) {
    const o = this.app.orm;
    const s = this.app.services;
    return s.AuthService.findAuthed(token).then(user =>
      o.Client.create({
        name,
        redirectUris,
        user: user.id
      }).then(client => client)
    );
  }

  update(clientId, properties) {
    const o = this.app.orm;
    return o.Client.update(clientId, properties);
  }

  findOne(clientId) {
    const o = this.app.orm;
    return o.Client.findOne(clientId);
  }

  find() {
    const o = this.app.orm;
    return o.Client.find();
  }

  destroy(clientId) {
    const o = this.app.orm;
    return o.Client.destroy(clientId);
  }
}
