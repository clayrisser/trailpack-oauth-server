import Service from 'trails/service';
import boom from 'boom';
import dateFns from 'date-fns';
import jwt from 'jwt-simple';

export default class AuthService extends Service {

  register({ username, password }) {
    const o = this.app.orm;
    return o.User.create({
      username: username
    }).then((user) => {
      return new Promise((resolve, reject) => {
        user.setPassword(password);
        user.save((err) => {
          if (err) return reject(err);
          return resolve(user);
        });
      });
    });
  }

  login({ username, password }) {
    const o = this.app.orm;
    return o.User.findOne({ username }).then((user) => {
      if (!user) {
        throw boom.notFound(`No account exists for username '${username}'`, {
          username
        });
      }
      if (!user.validatePassword(password)) throw boom.badRequest('Invalid password');
      return user;
    });
  }

  encodeToken(userId) {
    const c = this.app.config;
    const payload = {
      iss: c.oauth.jwt.iss,
      userId,
      exp: dateFns.addDays(new Date(), 1)
    };
    return jwt.encode(payload, c.oauth.jwt.secret);
  }

  decodeToken(token) {
    const c = this.app.config;
    let payload = {};
    try {
      payload = jwt.decode(token, c.oauth.jwt.secret);
    } catch (e) {
      if (e.message === 'Token expired') throw boom.unauthorized(e.message);
      throw e;
    }
    return payload;
  }

  findAuthed(token) {
    const o = this.app.orm;
    const payload = this.decodeToken(token);
    return o.User.findOne({ id: payload.userId });
  }
}
