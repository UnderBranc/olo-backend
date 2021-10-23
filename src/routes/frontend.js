async function frontend(fastify) {
    
    fastify.get('/frontend', async(request, reply) => {
        reply.code(200).send("Welcome to OLO waste route optimization frontend backend.");
    })

}

module.exports = frontend