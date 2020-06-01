const amqp = require('amqplib');
const rabbitmqHost = '192.168.99.100';
const rabbitmqUrl = `amqp://${rabbitmqHost}`;

async function main() {
  const connection = await amqp.connect(rabbitmqUrl);
  const channel = await connection.createChannel();
  await channel.assertQueue('echo');
  channel.consume('echo', msg => {
    if (msg) {
      console.log(msg.content.toString());
    }
    channel.ack(msg);
  });
}

main();
