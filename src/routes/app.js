const stream = require('stream');
const fs = require('fs');

async function app(fastify) {
    
    fastify.get('/', async(request, reply) => {
        reply.code(200).send("Welcome to OLO waste route optimization app backend.");
    })

    fastify.get('/notify/:id', async(request, reply) => {
        const {
            id
        } = request.params;
        //Notify the system and mark it in database
        reply.code(200).send(`Garbage bin with ID: ${id} was marked for pickup`);
    })

    fastify.post('/notify/:id/image', async(request, reply) => {
        const {
            id //id in database
        } = request.params;
        console.log(request.file)
        const options = { limits: { files: 1, fileSize: 30000000 /*max 30mb*/ } };
		const image = await request.file(options);
        
        //return if success or some sort of error happened

        if (!image.readable){
            reply.code(200).send('No image provided.');
        }
       
        else {
            const filename = 'test.' + image.mimetype;
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
            //verify the image with AI
        }
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