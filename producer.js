const amqp = require('amqplib');
const rabbitmqHost = '192.168.99.100';
const rabbitmqUrl = `amqp://${rabbitmqHost}`;

async function main() {
  const connection = await amqp.connect(rabbitmqUrl);
  const channel = await connection.createChannel();
  await channel.assertQueue('echo');
  const message = "The quick brown fox jumped over the lazy dog";
  message.split(' ').forEach(word => {
    channel.sendToQueue('echo', Buffer.from(word));
  });
  setTimeout(() => connection.close(), 500);
}

main();
