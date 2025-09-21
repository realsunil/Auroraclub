module.exports = {
  name: 'addrole',
  description: 'Add a role to a user.',
  permissions: ['ManageRoles'],
  async execute(client, message, args) {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.reply('Please mention a user or provide their ID.');

    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
    if (!role) return message.reply('Please mention a role or provide its ID.');

    if (role.position >= message.guild.members.me.roles.highest.position)
      return message.reply('I cannot assign a role higher or equal to my highest role.');

    try {
      await member.roles.add(role);
      message.channel.send(`✅ Added role ${role.name} to ${member.user.tag}.`);
    } catch (error) {
      console.error(error);
      message.reply('Failed to add role.');
    }
  },
};
