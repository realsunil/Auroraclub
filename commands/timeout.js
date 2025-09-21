module.exports = {
  name: 'timeout',
  description: 'Timeout a member for a specific duration (in minutes).',
  permissions: ['ModerateMembers'],
  async execute(client, message, args) {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    const duration = args[1]; // in minutes
    if (!member) return message.reply('Please mention a user or provide their ID.');
    if (!duration || isNaN(duration))
      return message.reply('Please specify a timeout duration in minutes.');

    try {
      const timeMs = parseInt(duration) * 60 * 1000;
      await member.timeout(timeMs, `Timed out by ${message.author.tag}`);
      message.channel.send(`⏱️ ${member.user.tag} has been timed out for ${duration} minutes.`);
    } catch (err) {
      console.error(err);
      message.reply('Failed to timeout the user. Make sure your bot has permission.');
    }
  },
};
