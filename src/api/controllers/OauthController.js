import AccessDeniedError from 'oauth2-server/lib/errors/access-denied-error';
import Controller from 'trails/controller';
import OAuth2Server from 'oauth2-server';
import url from 'url';
import { addSeconds } from 'date-fns';

const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;

export default class OauthController extends Controller {

  authenticate(req, res, next) {
    const request = new Request(req);
    const response = new Response(res);
    return this.app.oauth.authenticate(request, response).then((payload) => res.json(payload)).catch(next);
  }

  authorize(req, res, next) {
    return Promise.resolve().then(async () => {
      const c = this.app.config;
      const s = this.app.services;
      const request = new Request(req);
      const response = new Response(res);
      if (req.cookies.access_token) {
        req.accessToken = req.cookies.access_token;
      } else {
        const { authorization } = req.headers;
        if (authorization.substr(0, 7) !== 'Bearer ') throw boom.badRequest('Missing bearer token');
        const bearerToken = authorization.substr(7);
        if (!s.OauthService.isOauthToken(bearerToken)) {
          req.accessToken = bearerToken;
        }
      }
      if (req.accessToken) {
        const client = await s.OauthService.getClient(req.query.client_id);
        const user = await s.AuthService.findAuthed(req.accessToken);
        const token = {
          accessToken: await s.OauthService.generateAccessToken(client, user, req.params.scope),
          accessTokenExpiresAt: addSeconds(new Date(), c.oauth.accessTokenExpiresAt),
          scope: await s.OauthService.validateScope(user, client, req.params.scope)
        };
        await s.OauthService.saveToken(token, client, user);
        request.headers.authorization = `Bearer ${token.accessToken}`;
      }
      return this.app.oauth.authorize(request, response).then(async (code) => res.redirect(url.format({
          pathname: code.redirectUri,
          query: { code: code.authorizationCode }
        }))).catch((err) => {
        if (err instanceof AccessDeniedError) {
          return res.status(401).json({ message: err.message });
        }
        throw err;
      });
    }).catch(next);
  }

  token(req, res, next) {
    const request = new Request(req);
    const response = new Response(res);
    return this.app.oauth.token(request, response).then((payload) => res.json(payload)).catch(next);
  }
}
