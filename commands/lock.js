module.exports = {
  name: 'lock',
  description: 'Lock the current channel (deny send messages for @everyone).',
  permissions: ['ManageChannels'],
  async execute(client, message) {
    try {
      await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        SendMessages: false,
      });
      message.channel.send('🔒 Channel has been locked.');
    } catch (err) {
      console.error(err);
      message.reply('Failed to lock the channel.');
    }
  },
};
