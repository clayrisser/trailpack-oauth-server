import Policy from 'trails/policy';
import boom from 'boom';
import _ from 'lodash';

export default class OauthServer extends Policy {
  async isLoggedIn(req, res, next) {
    const c = this.app.config;
    try {
      if (!_.get(req, c.oauth.userSession, {}).id) {
        throw boom.unauthorized('user not logged in');
      }
      return next();
    } catch (err) {
      return next(err);
    }
  }
}
