module.exports = {
  name: 'untimeout',
  description: 'Remove timeout from a member.',
  permissions: ['ModerateMembers'],
  async execute(client, message, args) {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.reply('Please mention a user or provide their ID.');

    try {
      await member.timeout(null, `Timeout removed by ${message.author.tag}`);
      message.channel.send(`⏰ Timeout removed from ${member.user.tag}.`);
    } catch (err) {
      console.error(err);
      message.reply('Failed to remove timeout.');
    }
  },
};
