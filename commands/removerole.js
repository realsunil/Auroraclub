module.exports = {
  name: 'removerole',
  description: 'Remove a role from a user.',
  permissions: ['ManageRoles'],
  async execute(client, message, args) {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.reply('Please mention a user or provide their ID.');

    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
    if (!role) return message.reply('Please mention a role or provide its ID.');

    try {
      await member.roles.remove(role);
      message.channel.send(`✅ Removed role ${role.name} from ${member.user.tag}.`);
    } catch (error) {
      console.error(error);
      message.reply('Failed to remove role.');
    }
  },
};
