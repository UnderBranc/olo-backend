async function dashboard(fastify) {
    
    fastify.get('/dashboard', async(request, reply) => {
        reply.code(200).send("Welcome to OLO waste route optimization dashboard backend.");
    })

}

module.exports = dashboard