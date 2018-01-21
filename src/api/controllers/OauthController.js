import Controller from 'trails/controller';
import OAuth2Server from 'oauth2-server';
import AccessDeniedError from 'oauth2-server/lib/errors/access-denied-error';
import { AbstractGrantType } from 'oauth2-server';
import url from 'url';

const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;

export default class OauthController extends Controller {

  authenticate(req, res, next) {
    const request = new Request(req);
    const response = new Response(res);
    return this.app.oauth.authenticate(request, response).then((token) => {
      return res.json({ token: token });
    }).catch(next);
  }

  authorize(req, res, next) {
    return Promise.resolve().then(async () => {
      const s = this.app.services;
      const request = new Request(req);
      const response = new Response(res);
      let token = null;
      if (req.cookies.access_token && !req.headers.authorization) {
        const client = await s.OauthService.getClient(req.query.client_id);
        const user = await s.AuthService.findAuthed(req.cookies.access_token);
        const abstractGrant = new AbstractGrantType({
          accessTokenLifetime: 123,
          model: s.OauthService.getModel()
        });
        const token = {
          accessToken: await abstractGrant.generateAccessToken(client, user, req.params.scope),
          accessTokenExpiresAt: abstractGrant.getAccessTokenExpiresAt(client, user, req.params.scope),
          scope: await abstractGrant.validateScope(user, client, req.params.scope),
        };
        client.id = client.accessKey;
        await s.OauthService.saveToken(token, client, user);
        request.headers.authorization = `Bearer ${token.accessToken}`;
      }
      return this.app.oauth.authorize(request, response).then(async (code) => {
        if (token) {
          await s.OauthService.revokeToken(token);
        }
        return res.redirect(url.format({
          pathname: code.redirectUri,
          query: { code: code.authorizationCode }
        }));
      }).catch((err) => {
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
    return this.app.oauth.token(request, response).then((token) => {
      return res.json({ token: token });
    }).catch(next);
  }
}
