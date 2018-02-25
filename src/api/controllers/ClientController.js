import Controller from 'trails/controller';

export default class ClientController extends Controller {
  create(req, res, next) {
    const s = this.app.services;
    return s.ClientService.create(req.cookies.access_token, req.body)
      .then(client => res.json(client))
      .catch(next);
  }
}
