const fastify = require('fastify')()
const path = require('path')
const AutoLoad = require('fastify-autoload')

//enables CORS
fastify.register(require('fastify-cors'), {
   origin: "*",
   allowedHeaders: ['Origin', 'X-Requested-With', 'Accept', 'Content-Type', 'Authorization', 'Content-Disposition'
   , 'name', 'user', 'auth' ],
   methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE']
})

// //allows serving static image files from url
// fastify.register(require('fastify-static'), {
//   root: path.join(__dirname, 'data/img'),
//   prefix: '/img', // optional: default '/'
// })

//allows accepting of file uploads to server
// fastify.addContentTypeParser('*', function (req, done) {
//   done(null, req)
// })

fastify.register(require('fastify-swagger'), {
	routePrefix: '/docs',
	swagger: {
		info: {
			title: 'Swagger for OLO backend',
			description: 'Documentation for all the endpoints implemented by OLO backend',
			version: '0.1.0'
		},
		host: 'localhost:3000',
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
    dir: path.join(__dirname, 'routes')
})

//run server and listen on port 3000 for requests, if err then shutdown
fastify.listen(3000, (err) => {
    if (err) {
        console.log(err)
        process.exit(1)
    } else {
        console.log('Server is up on port 3000...')
    }
})