module.exports = {
  name: 'unban',
  description: 'Unban a user from the server.',
  permissions: ['BanMembers'],
  async execute(client, message, args) {
    // Check if user provided an ID
    const userId = args[0];
    if (!userId) {
      return message.reply('❌ Please provide the **user ID** to unban.\nExample: `~unban 123456789012345678`');
    }

    try {
      // Fetch all banned users
      const banList = await message.guild.bans.fetch();
      const bannedUser = banList.get(userId);

      if (!bannedUser) {
        return message.reply('❌ This user is **not banned** or the ID is incorrect.');
      }

      // Unban the user
      await message.guild.members.unban(userId);

      message.channel.send(`✅ Successfully unbanned **${bannedUser.user.tag}** (\`${userId}\`).`);
    } catch (err) {
      console.error(`Unban Error:`, err);
      message.reply('❌ An error occurred while trying to unban the user. Please make sure the ID is correct.');
    }
  }
};
