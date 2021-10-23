const stream = require('stream');
const fs = require('fs');
const crypto = require('crypto');

async function app(fastify) {
    
    fastify.get('/', async(request, reply) => {
        reply.code(200).send("Welcome to OLO waste route optimization app backend.");
    })

    fastify.get('/notify/:id', async(request, reply) => {
        const {
            id
        } = request.params;

        //check if id exists
        //Notify the system and mark it in database
        return fastify.pg.transact(async client => {
            const { rows } = await client.query(
                'SELECT id FROM bins WHERE id = $1', [id]
            )
            if(!rows.length)
                return reply.code(400).send(`No bin with ID: [ ${id} ] is registered in our system.`);
            const result = await client.query('INSERT INTO notifications(bin_id, date, status, severity, image) VALUES($1, NOW(), $2, $3, $4) RETURNING id', [id, 'PENDING', 0.0, null])
            return {message: 'Bin successfully reported. Thank you for helping the ecosystem!', id: result.rows[0].id}
        })
        //reply.code(400).send('Something went wrong. Please try again later.')
    })

    fastify.post('/notify/:id/image', async(request, reply) => {
        const {
            id //id in database
        } = request.params;
        console.log(request.file)
        const options = { limits: { files: 1, fileSize: 30000000 /*max 30mb*/ } };
		const image = await request.file(options);
    
        //return if success or some sort of error happened
        let hash = crypto.createHash('md5').update(id).digest('hex')
        const filename = `${hash.substring(0,15)}` + '.png'
        const dir = 'data/';
        stream.pipeline(                                 					   //store initial file to specified directory
            image.file,
            fs.createWriteStream(`${dir}/${filename}`),
            (err) => {
                if(err){
                    console.log('Error during writing file, deleting...');
                    fs.unlinkSync(`${dir}/${filename}`);      					//delete file if error occured
                    return reply.code(400).send(new Error('Error during writing file'));
                }
                else{
                    console.log(`File stored to ${dir}/${filename}`);
                }
            }
        );
        fastify.pg.transact(async client => {
                const { rows } = await client.query(
                    'SELECT id FROM notifications WHERE id = $1', [id]
                )
                if(!rows.length){
                   reply.code(400).send(`No notifiaction with ID: [ ${id} ] is registered in our system.`);
                   throw new Error('Invalid ID');
                }
                await client.query('UPDATE notifications SET image = $1 where id = $2', [filename, id]);
                return reply.code(200).send("Image successfully uploaded. Thank you for helping the ecosystem.")
        })
        //verify the image with AI
    })

    fastify.get('/check/:id', async(request, reply) => {
        const {
            id
        } = request.params;
        //check if id is valid
        //return basic info about the bin
    })
}

module.exports = app
module.exports.autoPrefix = '/frontend'