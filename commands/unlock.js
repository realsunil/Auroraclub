module.exports = {
  name: 'unlock',
  description: 'Unlock the current channel (allow send messages for @everyone).',
  permissions: ['ManageChannels'],
  async execute(client, message) {
    try {
      await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        SendMessages: true,
      });
      message.channel.send('🔓 Channel has been unlocked.');
    } catch (err) {
      console.error(err);
      message.reply('Failed to unlock the channel.');
    }
  },
};
