const fastify = require('fastify')()
const path = require('path')
const AutoLoad = require('fastify-autoload')
const Env = require('../env-config')

fastify.register(require('fastify-multipart'));

//enables CORS
fastify.register(require('fastify-cors'), {
   origin: "*",
   allowedHeaders: ['Origin', 'X-Requested-With', 'Accept', 'Content-Type', 'Authorization', 'Content-Disposition'
   , 'name', 'user', 'auth' ],
   methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE']
})

//allows serving static image files from url
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, '../data'),
  prefix: '/img/'
})

//allows accepting of file uploads to server
fastify.addContentTypeParser('*', function (req, body, done) {
  done()
})

fastify.register(require('fastify-swagger'), {
	routePrefix: '/docs',
	swagger: {
		info: {
			title: 'Swagger for OLO backend',
			description: 'Documentation for all the endpoints implemented by OLO backend',
			version: '0.1.0'
		},
		host: `localhost:${Env.port}`,
		schemes: ['http'],
		consumes: ['application/json'],
		produces: ['application/json'],
		tags: [],
		definitions: {
		}
	},
	exposeRoute: true
})

fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    dirNameRoutePrefix: true
})

fastify.register(require('fastify-postgres'), {
    connectionString: Env.connectionString
  })

//limit requests from one IP
fastify.register(require('fastify-rate-limit'), {
	max: 100,
	allowList: ['127.0.0.1'],
	timeWindow: '1 minute'
});

//run server and listen on port 3000 for requests, if err then shutdown
fastify.listen(Env.port, (err) => {
    if (err) {
        console.log(err)
        process.exit(1)
    } else {
        console.log(`Server is up on port ${Env.port}...`)
    }
})