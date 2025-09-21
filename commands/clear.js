module.exports = {
  name: 'clear',
  description: 'Delete a number of messages in the channel (max 100).',
  permissions: ['ManageMessages'],
  async execute(client, message, args) {
    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount < 1 || amount > 100) return message.reply('Please provide a number between 1 and 100.');

    await message.channel.bulkDelete(amount + 1, true); // +1 to delete the command message
    message.channel.send(`🧹 Deleted ${amount} messages.`).then(msg => setTimeout(() => msg.delete(), 3000));
  },
};
