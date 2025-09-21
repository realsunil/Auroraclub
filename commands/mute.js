module.exports = {
  name: 'mute',
  description: 'Mute a member by adding a "Muted" role.',
  permissions: ['ModerateMembers'], // Use ModerateMembers permission or ManageRoles if using role mute
  async execute(client, message, args) {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.reply('Please mention a user or provide their ID.');

    let mutedRole = message.guild.roles.cache.find(r => r.name === 'Muted');
    if (!mutedRole) {
      try {
        mutedRole = await message.guild.roles.create({
          name: 'Muted',
          color: '#514f48',
          permissions: [],
        });

        // Deny sending messages & speaking in all channels
        message.guild.channels.cache.forEach(async (channel) => {
          await channel.permissionOverwrites.edit(mutedRole, {
            SendMessages: false,
            Speak: false,
            AddReactions: false,
          });
        });
      } catch (err) {
        console.error(err);
        return message.reply('Failed to create Muted role.');
      }
    }

    if (member.roles.cache.has(mutedRole.id))
      return message.reply('User is already muted.');

    try {
      await member.roles.add(mutedRole);
      message.channel.send(`🔇 ${member.user.tag} has been muted.`);
    } catch (err) {
      console.error(err);
      message.reply('Failed to mute the user.');
    }
  },
};
