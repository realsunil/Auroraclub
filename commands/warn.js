module.exports = {
  name: 'warn',
  description: 'Warn a user.',
  permissions: ['ManageMessages'],
  async execute(client, message, args) {
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!user) return message.reply('Please mention a user to warn.');

    const reason = args.slice(1).join(' ') || 'No reason specified';

    // Here you could log warnings in a DB or file - skipping for now

    message.channel.send(`⚠️ ${user.user.tag} has been warned. Reason: ${reason}`);
  },
};
