// events/guildMemberAdd.js
const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../data/greetChannels.json');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    // Load config
    if (!fs.existsSync(configPath)) return;
    const data = JSON.parse(fs.readFileSync(configPath));
    const channelId = data[member.guild.id];
    if (!channelId) return;

    const channel = member.guild.channels.cache.get(channelId);
    if (!channel || !channel.isTextBased()) return;

    try {
      const msg = await channel.send(`👋 Welcome, ${member}!`);
      setTimeout(() => msg.delete().catch(() => {}), 2000); // 2 seconds
    } catch (err) {
      console.error(`Welcome message failed:`, err);
    }
  },
};
