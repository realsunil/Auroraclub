const ms = require('ms');

module.exports = {
  name: 'tempban',
  description: 'Temporarily ban a user: !tempban <user> <duration> [reason]',
  permissions: ['BanMembers'],
  async execute(client, message, args) {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.reply('Please mention a valid member to tempban.');

    if (!member.bannable) return message.reply('I cannot ban this user.');

    const duration = ms(args[1]);
    if (!duration) return message.reply('Invalid duration.');

    const reason = args.slice(2).join(' ') || 'No reason provided';

    await member.ban({ reason });

    message.channel.send(`✅ ${member.user.tag} was banned for ${args[1]}. Reason: ${reason}`);

    // Reminder to unban manually or implement scheduler for auto unban
  },
};
