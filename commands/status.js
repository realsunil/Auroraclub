const { PermissionsBitField, ActivityType } = require("discord.js");

module.exports = {
  name: "status",
  description: "Change bot status (activity)",
  usage: "status <PLAYING|WATCHING|LISTENING|COMPETING> <text>",
  permissions: [PermissionsBitField.Flags.ManageGuild],
  
  execute: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return message.reply("You need Manage Server permission to change status.");
    }
    if (args.length < 2) {
      return message.reply("Usage: status <PLAYING|WATCHING|LISTENING|COMPETING> <text>");
    }

    const typeInput = args.shift().toUpperCase();
    const validTypes = ["PLAYING", "WATCHING", "LISTENING", "COMPETING"];

    if (!validTypes.includes(typeInput)) {
      return message.reply(`Invalid type. Valid types: ${validTypes.join(", ")}`);
    }

    // Map string to ActivityType enum
    const typeMap = {
      PLAYING: ActivityType.Playing,
      WATCHING: ActivityType.Watching,
      LISTENING: ActivityType.Listening,
      COMPETING: ActivityType.Competing,
    };

    const statusText = args.join(" ");
    await client.user.setActivity(statusText, { type: typeMap[typeInput] });

    message.channel.send(`Status updated to: **${typeInput} ${statusText}**`);
  },
};
  