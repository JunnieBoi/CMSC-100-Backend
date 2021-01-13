const Fastify = require("fastify");
const {routes} = require('./route');
const { connect } = require('./db');
const swagger = require('fastify-swagger');
const { definitions } = require('./definitions');
const { name: title, description, version } = require('./package.json');
const sensible = require('fastify-sensible');
const { errorHandler } = require('./error-handler');
const jwt = require('fastify-jwt');
const { readFileSync } = require('fs');


const audience = 'this-audience';
const issuer = 'localhost';


exports.build = async(opts = {logger:false,trustProxy:false}) =>
{
    const app = Fastify(opts);
    
    app.register(sensible).after(() => {
      app.setErrorHandler(errorHandler);
    });

     app.register(jwt, {
    secret: {
      private: readFileSync('./cert/keyfile', 'utf8'),
      public: readFileSync('./cert/keyfile.key.pub', 'utf8')
    },
    sign: {
      algorithm: 'RS256',
      audience,
      issuer,
      expiresIn: '1h'
    },
    verify: {
      audience,
      issuer
    }
  });

  
    app.register(swagger, {
        routePrefix: '/docs',
        exposeRoute: true,
        swagger: {
          info: {
            title,
            description,
            version
          },
          schemes: ['http', 'https'],
          consumes: ['application/json'],
          produces: ['application/json'],
          definitions
        }
      });
    
    await connect();
    routes(app);
    return app;
}




