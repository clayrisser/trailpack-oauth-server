import Controller from 'trails/controller';

export default class UserController extends Controller {

  create(req, res, next) {
    const s = this.app.services;
    return s.UserService.create(req.body).then((user) => {
      return res.json(user);
    }).catch(next);
  }
}
