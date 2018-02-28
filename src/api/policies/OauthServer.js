import Policy from 'trails/policy';
import boom from 'boom';
import _ from 'lodash';

export default class AuthPolicy extends Policy {
  async isLoggedIn(req, res, next) {
    try {
      if (!_.get(req, 'user.id')) throw boom.unauthorized('user not logged in');
      return next();
    } catch (err) {
      return next(err);
    }
  }
}
