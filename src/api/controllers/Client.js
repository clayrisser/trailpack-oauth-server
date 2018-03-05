import Controller from 'trails/controller';
import _ from 'lodash';

export default class Client extends Controller {
  async create(req, res, next) {
    try {
      const c = this.app.config;
      const s = this.app.services;
      const client = await s.Client.create(
        _.get(req, c.oauth.userSession, {}).id,
        req.body
      );
      return res.json(client);
    } catch (err) {
      return next(err);
    }
  }

  async update(req, res, next) {
    try {
      const c = this.app.config;
      const s = this.app.services;
      const client = await s.Client.update(
        _.get(req, c.oauth.userSession, {}).id,
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
      const c = this.app.config;
      const s = this.app.services;
      const client = await s.Client.destroy(
        _.get(req, c.oauth.userSession, {}).id,
        req.params.clientId
      );
      return res.json(client);
    } catch (err) {
      return next(err);
    }
  }

  async find(req, res, next) {
    try {
      const c = this.app.config;
      const s = this.app.services;
      const client = await s.Client.find(
        _.get(req, c.oauth.userSession, {}).id,
        req.query
      );
      return res.json(client);
    } catch (err) {
      return next(err);
    }
  }

  async findOne(req, res, next) {
    try {
      const c = this.app.config;
      const s = this.app.services;
      const client = await s.Client.findOne(
        _.get(req, c.oauth.userSession, {}).id,
        req.params.clientId
      );
      return res.json(client);
    } catch (err) {
      return next(err);
    }
  }
}
