import Controller from 'trails/controller';

export default class Client extends Controller {
  async create(req, res, next) {
    try {
      const s = this.app.services;
      const client = await s.Client.create(req.user.id, req.body);
      return res.json(client);
    } catch (err) {
      return next(err);
    }
  }

  async update(req, res, next) {
    try {
      const s = this.app.services;
      const client = await s.Client.update(
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
      const client = await s.Client.destroy(req.user.id, req.params.clientId);
      return res.json(client);
    } catch (err) {
      return next(err);
    }
  }

  async find(req, res, next) {
    try {
      const s = this.app.services;
      const client = await s.Client.find(req.user.id, req.query);
      return res.json(client);
    } catch (err) {
      return next(err);
    }
  }

  async findOne(req, res, next) {
    try {
      const s = this.app.services;
      const client = await s.Client.findOne(req.user.id, req.params.clientId);
      return res.json(client);
    } catch (err) {
      return next(err);
    }
  }
}
