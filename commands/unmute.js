module.exports = {
  name: 'unmute',
  description: 'Unmute a member by removing the "Muted" role.',
  permissions: ['ModerateMembers'],
  async execute(client, message, args) {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.reply('Please mention a user or provide their ID.');

    const mutedRole = message.guild.roles.cache.find(r => r.name === 'Muted');
    if (!mutedRole || !member.roles.cache.has(mutedRole.id))
      return message.reply('User is not muted.');

    try {
      await member.roles.remove(mutedRole);
      message.channel.send(`🔈 ${member.user.tag} has been unmuted.`);
    } catch (err) {
      console.error(err);
      message.reply('Failed to unmute the user.');
    }
  },
};
