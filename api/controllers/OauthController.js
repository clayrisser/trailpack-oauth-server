const Controller = require('trails/controller');
const OAuth2Server = require('oauth2-server');
const AccessDeniedError = require('oauth2-server/lib/errors/access-denied-error');

const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;

module.exports = class OauthController extends Controller {

  authenticate(req, res, next) {
    const request = new Request(req);
    const response = new Response(res);
    return oauth.authenticate(request, response).then((token) => {
      return res.json({ token: token });
    }).catch(next);
  }

  authorize(req, res, next) {
    const request = new Request(req);
    const response = new Response(res);
    return oauth.authorize(request, response).then((code) => {
      return res.json({ code: code });
    }).catch((err) => {
      if (err instanceof AccessDeniedError) {
        return res.status(401).json({ message: err.message });
      } else {
        return next(err);
      }
    });
  }

  token(req, res, next) {
    const request = new Request(req);
    const response = new Response(res);
    return oauth.token(request, response).then((token) => {
      return res.json({ token: token });
    }).catch(next);
  }
};
