
const jimp = require('jimp');
const fs = require('fs');
const sizeOf = require('image-size');

const { connectToDB } = require('./lib/mongo');
const { connectToRabbitMQ, getChannel } = require('./lib/rabbitmq');
const { getDownloadStreamById, updateImageSizeById } = require('./models/image');

connectToDB(async () => {
  await connectToRabbitMQ('images');
  const channel = getChannel();
  channel.consume('images', msg => {


    const id = msg.content.toString();
    const imageChunks = [];
    getDownloadStreamById(id)
      .on('data', chunk => {
        imageChunks.push(chunk);
      })
      .on('end', async () => {
        const dimensions = sizeOf(Buffer.concat(imageChunks));
        console.log(`== Dimensions for image ${id}:`, dimensions);
        const result = await updateImageSizeById(id, dimensions);
        
        jimp.read(Buffer.concat(imageData), (err, lenna) => {
          const sizes = [128, 256, 640, 1024];

          if (err) throw err;

          lenna
            .resize(dimensions.width, dimensions.height)
            .quality(60)
            .greyscale()
            .write('./uploads/' + id + "_orig.jpg");

          sizes.forEach(function (size) {
            lenna
              .resize(size, size)
              .quality(60)
              .greyscale()
              .write('./uploads/' + id + "_" + size + '.jpg');
          });
        });

      });
      channel.ack(msg);


  });
});
