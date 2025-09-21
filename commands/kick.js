module.exports = {
  name: 'kick',
  description: 'Kick a member from the server.',
  permissions: ['KickMembers'],
  async execute(client, message, args) {
    if (!args[0]) return message.reply('Please mention a user or provide their ID.');

    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!user) return message.reply('User not found.');

    if (!user.kickable) return message.reply('I cannot kick this user.');

    const reason = args.slice(1).join(' ') || 'No reason provided';
    await user.kick(reason);
    message.channel.send(`${user.user.tag} was kicked. Reason: ${reason}`);
  },
};
