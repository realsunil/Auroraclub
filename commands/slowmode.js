const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "slowmode",
  description: "Set slowmode delay for the channel",
  usage: "slowmode <seconds>",
  permissions: [PermissionsBitField.Flags.ManageChannels],
  execute: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return message.reply("You need Manage Channels permission to set slowmode.");
    }
    const time = parseInt(args[0]);
    if (isNaN(time) || time < 0 || time > 21600) {
      return message.reply("Please provide a valid number between 0 and 21600 seconds (6 hours).");
    }
    try {
      await message.channel.setRateLimitPerUser(time);
      message.channel.send(`Slowmode has been set to ${time} seconds.`);
    } catch (error) {
      message.reply("I do not have permission to change slowmode in this channel.");
    }
  },
};
