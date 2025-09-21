module.exports = {
  name: 'roleinfo', // command name (lowercase)
  description: 'Shows info about a role', // optional, but recommended
  async execute(client, message, args) {
    // Your command logic here
    // For example:
    const roleName = args.join(' ');
    if (!roleName) return message.reply('Please specify a role name.');

    const role = message.guild.roles.cache.find(r => r.name.toLowerCase() === roleName.toLowerCase());
    if (!role) return message.reply('Role not found.');

    message.channel.send(`Role ${role.name} has ${role.members.size} members.`);
  },
};
