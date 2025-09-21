module.exports = {
  name: 'ban',
  description: 'Ban a user from the server.',
  permissions: ['BanMembers'],
  async execute(client, message, args) {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.reply('Please mention a valid member to ban.');
    if (!member.bannable) return message.reply('I cannot ban this user.');

    const reason = args.slice(1).join(' ') || 'No reason provided';
    await member.ban({ reason });
    message.channel.send(`✅ ${member.user.tag} was banned. Reason: ${reason}`);
  },
};
