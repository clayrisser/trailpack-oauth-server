import joi from 'joi';

export default [
  {
    method: 'GET',
    path: '/oauth/authenticate',
    handler: 'OauthController.authenticate',
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
    handler: 'OauthController.authorize',
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
    handler: 'OauthController.token',
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
  },
  {
    method: 'POST',
    path: '/client',
    handler: 'ClientController.create',
    config: {
      validate: {
        headers: joi
          .object({
            ['content-type']: joi
              .string()
              .valid('application/json')
              .required()
          })
          .options({ allowUnknown: true }),
        payload: joi.object({
          name: joi
            .string()
            .min(3)
            .max(32)
            .required(),
          redirectUris: joi
            .array()
            .items(joi.string().uri())
            .min(1)
            .required(),
          grants: joi
            .array()
            .items(
              joi
                .string()
                .valid(
                  'password',
                  'authorization_code',
                  'refresh_token',
                  'client_credentials'
                )
            )
        })
      }
    }
  }
];
