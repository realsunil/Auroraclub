const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "poll",
  description: "Create a simple poll with reactions",
  usage: "poll <question>",
  permissions: [PermissionsBitField.Flags.SendMessages],
  execute: async (client, message, args) => {
    if (!args.length) return message.reply("Please provide a question for the poll.");

    const question = args.join(" ");
    const embed = new EmbedBuilder()
      .setTitle("📊 Poll")
      .setDescription(question)
      .setColor("Green")
      .setFooter({ text: `Poll by ${message.author.tag}` })
      .setTimestamp();

    const pollMessage = await message.channel.send({ embeds: [embed] });
    await pollMessage.react("👍");
    await pollMessage.react("👎");
  },
};
