import Controller from 'trails/controller';

export default class AuthController extends Controller {

  register(req, res, next) {
    const s = this.app.services;
    return s.AuthService.register(req.body).then(async (user) => {
      const token = s.AuthService.encodeToken(user.id);
      res.cookie('access_token', token);
      return res.json(user);
    }).catch(next);
  }

  login(req, res, next) {
    const s = this.app.services;
    return s.AuthService.login(req.body).then((user) => {
      const token = s.AuthService.encodeToken(user.id);
      res.cookie('access_token', token);
      return res.json(user);
    }).catch(next);
  }
}
