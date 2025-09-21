module.exports = {
  name: 'ping',
  description: 'Returns bot latency.',
  permissions: [], // no special permissions required
  async execute(client, message, args) {
    const sent = await message.channel.send('Pinging...');
    sent.edit(`Pong! Latency is ${sent.createdTimestamp - message.createdTimestamp}ms.`);
  },
};
