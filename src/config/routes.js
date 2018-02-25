import joi from 'joi';

export default [
  {
    method: 'GET',
    path: '/oauth/authenticate',
    handler: 'OauthController.authenticate'
  },
  {
    method: 'GET',
    path: '/oauth/authorize',
    handler: 'OauthController.authorize'
  },
  {
    method: 'POST',
    path: '/oauth/token',
    handler: 'OauthController.token'
  },
  {
    method: 'POST',
    path: '/client',
    handler: 'ClientController.create',
    config: {
      validate: {
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
