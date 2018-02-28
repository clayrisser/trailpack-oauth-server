import joi from 'joi';

const grants = [
  'password',
  'authorization_code',
  'refresh_token',
  'client_credentials'
];

export default [
  {
    method: 'POST',
    path: '/client',
    handler: 'Client.create',
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
          grants: joi.array().items(joi.string().valid(...grants))
        })
      }
    }
  },
  {
    method: 'DELETE',
    path: '/client/{clientId}',
    handler: 'Client.destroy',
    config: {
      validate: {
        params: joi.object({
          clientId: joi.string().required()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/client',
    handler: 'Client.find',
    config: {
      validate: {
        query: joi.object({
          name: joi
            .string()
            .min(3)
            .max(32)
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/client/{clientId}',
    handler: 'Client.findOne',
    config: {
      validate: {
        params: joi.object({
          clientId: joi.string().required()
        })
      }
    }
  },
  {
    method: 'PUT',
    path: '/client/{clientId}',
    handler: 'Client.update',
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
        params: joi.object({
          clientId: joi.string().required()
        }),
        payload: joi.object({
          name: joi
            .string()
            .min(3)
            .max(32),
          redirectUris: joi
            .array()
            .items(joi.string().uri())
            .min(1),
          grants: joi.array().items(joi.string().valid(...grants))
        })
      }
    }
  }
];
