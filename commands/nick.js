// commands/nick.js
const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "nick",
  description: "Change a user's nickname",
  usage: "<@user> <new nickname>",
  permissions: {
    client: [PermissionsBitField.Flags.ManageNicknames],
    user: [PermissionsBitField.Flags.ManageNicknames],
  },
  async execute(client, message, args) {
    if (!message.guild) return message.reply("This command can only be used in servers.");

    const member = message.mentions.members.first();
    if (!member) return message.reply("Please mention a user to change their nickname.");
    if (!args[1]) return message.reply("Please provide a new nickname.");

    const newNick = args.slice(1).join(" ");

    try {
      await member.setNickname(newNick);
      const embed = new EmbedBuilder()
        .setTitle("Nickname Changed")
        .setDescription(`${member.user.tag}'s nickname has been changed to **${newNick}**`)
        .setColor("Green")
        .setTimestamp();
      message.channel.send({ embeds: [embed] });
    } catch (error) {
      message.reply("I was unable to change that user's nickname. Make sure I have the correct permissions and my role is higher than the user's.");
    }
  },
};
