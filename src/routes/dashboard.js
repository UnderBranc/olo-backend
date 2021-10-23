async function dashboard(fastify) {

    //requires authentication in full version, out of scope for climathon prototype
    
    fastify.get('/', async(request, reply) => {
        reply.code(200).send("Welcome to OLO waste route optimization dashboard.");
    })

    fastify.get('/bins',async(request, reply) => {
        //get a list of all bins
        const client = await fastify.pg.connect()
        const { rows } = await client.query(
          'SELECT * FROM bins'
        )
        client.release()
        return reply.send(rows);
    })

    fastify.get('/bins/:id',async(request, reply) => {
        const {
            id
        } = request.params;
        const client = await fastify.pg.connect()
        const { rows } = await client.query(
          'SELECT * FROM bins WHERE id = $1', [id]
        )
        client.release()
        return reply.send(rows);
    })

    fastify.get('/notifications',async(request, reply) => {
        //get a list of all bins
        const client = await fastify.pg.connect()
        const { rows } = await client.query(
          'SELECT * FROM notifications as n JOIN bins as b on n.bin_id = b.id WHERE status = \'PENDING\''
        )
        client.release()
        return reply.send(rows);
    })

    fastify.get('/notifications/:id',async(request, reply) => {
        const {
            id
        } = request.params;
        const client = await fastify.pg.connect()
        const { rows } = await client.query(
          'SELECT * FROM notifications WHERE id = $1', [id]
        )
        client.release()
        return reply.send(rows);
    })
}

module.exports = dashboard
module.exports.autoPrefix = '/dashboard'