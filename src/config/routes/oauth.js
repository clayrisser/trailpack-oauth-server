import joi from 'joi';

export default [
  {
    method: 'GET',
    path: '/oauth/authenticate',
    handler: 'Oauth.authenticate',
    config: {
      validate: {
        headers: joi
          .object({
            authorization: joi.string().required()
          })
          .options({ allowUnknown: true })
      }
    }
  },
  {
    method: 'GET',
    path: '/oauth/authorize',
    handler: 'Oauth.authorize',
    config: {
      validate: {
        query: joi.object({
          client_id: joi
            .string()
            .length(32)
            .required(),
          response_type: joi
            .string()
            .valid('code')
            .required(),
          scope: joi.string().required(),
          state: joi.string().required()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/oauth/token',
    handler: 'Oauth.token',
    config: {
      validate: {
        headers: joi
          .object({
            authorization: joi.string().required(),
            ['content-type']: joi
              .string()
              .valid('application/x-www-form-urlencoded')
              .required()
          })
          .options({ allowUnknown: true }),
        payload: joi.object({
          grant_type: joi
            .string()
            .valid(
              'password',
              'authorization_code',
              'refresh_token',
              'client_credentials'
            )
            .required(),
          username: joi.string(),
          password: joi.string(),
          refresh_token: joi.string(),
          code: joi.string(),
          redirect_uri: joi.string()
        })
      }
    }
  }
];
