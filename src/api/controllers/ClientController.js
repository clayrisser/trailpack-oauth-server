import Controller from 'trails/controller';

export default class ClientController extends Controller {
  async create(req, res, next) {
    try {
      const s = this.app.services;
      const client = await s.ClientService.create(req.user.id, req.body);
      return res.json(client);
    } catch (err) {
      return next(err);
    }
  }

  async update(req, res, next) {
    try {
      const s = this.app.services;
      const client = await s.ClientService.update(
        req.user.id,
        req.params.clientId,
        req.body
      );
      return res.json(client);
    } catch (err) {
      return next(err);
    }
  }

  async destroy(req, res, next) {
    try {
      const s = this.app.services;
      const client = await s.ClientService.destroy(
        req.user.id,
        req.params.clientId
      );
      return res.json(client);
    } catch (err) {
      return next(err);
    }
  }

  async find(req, res, next) {
    try {
      const s = this.app.services;
      const client = await s.ClientService.find(req.user.id, req.query);
      return res.json(client);
    } catch (err) {
      return next(err);
    }
  }

  async findOne(req, res, next) {
    try {
      const s = this.app.services;
      const client = await s.ClientService.findOne(
        req.user.id,
        req.params.clientId
      );
      return res.json(client);
    } catch (err) {
      return next(err);
    }
  }
}
