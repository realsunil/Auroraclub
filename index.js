// index.js - Fully prefix‑less version for Aurora Club Bot
// -----------------------------------------------------------------------------
// This rewrite removes the prefix system entirely. Commands are triggered when
// the **first word** of a message (case‑insensitive) matches the command file’s
// exported `name`. All other functionality (DM logging, ticket system, etc.)
// remains unchanged.
// -----------------------------------------------------------------------------

require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  Collection,
  Partials,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");
const fs = require("fs");

// ─────────────────────────────────────────────────────────────────────────────
// Client Setup
// ─────────────────────────────────────────────────────────────────────────────
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers, // Needed for dmall and member management
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel], // Needed for DM channels
});

// Ticket category where ticket channels will be created.
const TICKET_CATEGORY_ID = "1389286690178203758"; // <- adjust if you change categories

// Collection that stores command modules (loaded dynamically)
client.commands = new Collection();

// ─────────────────────────────────────────────────────────────────────────────
// Dynamically load every JavaScript file inside ./commands
// ─────────────────────────────────────────────────────────────────────────────
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // Every command **MUST** export at least: name <string>, execute <Function>
  if ("name" in command && typeof command.execute === "function") {
    client.commands.set(command.name.toLowerCase(), command);
  } else {
    console.warn(
      `[WARNING] Command at ./commands/${file} is missing "name" or "execute".`
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Ready Event
// ─────────────────────────────────────────────────────────────────────────────
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  client.user.setActivity(`type a command name`);
});

// ─────────────────────────────────────────────────────────────────────────────
// Message Handling (Prefix‑less)
// ─────────────────────────────────────────────────────────────────────────────
client.on("messageCreate", async (message) => {
  // Ignore all bot messages
  if (message.author.bot) return;

  // ─── DM Logging ───────────────────────────────────────────────────────────
  if (message.channel.type === ChannelType.DM) {
    const logChannelId = "1377865584850505758"; // DM log channel in your guild
    const logChannel = client.channels.cache.get(logChannelId);
    if (logChannel) {
      const embed = new EmbedBuilder()
        .setTitle("📩 New DM Received")
        .addFields(
          { name: "User", value: `${message.author.tag} (${message.author.id})` },
          { name: "Message", value: message.content || "[No Text]" }
        )
        .setColor("#FFA500")
        .setTimestamp();
      logChannel.send({ embeds: [embed] });
    }
    return; // Stop here; we don't run commands in DMs
  }

  // We only process commands in guild text channels
  if (!message.guild) return;

  // Split message into words => first word = command name, rest = args
  const words = message.content.trim().split(/ +/);
  const cmdName = words.shift().toLowerCase();

  const command = client.commands.get(cmdName);
  if (!command) return; // Not a recognised command, ignore.

  // Permission check (optional field in command definition)
  if (command.permissions) {
    const authorPerms = message.channel.permissionsFor(message.author);
    if (!authorPerms || !command.permissions.every((p) => authorPerms.has(p))) {
      return message.reply(
        `❌ You need these permissions to use this command: ${command.permissions.join(", ")}`
      );
    }
  }

  // Execute the command
  try {
    await command.execute(client, message, words /* args */, null /* prefixes map removed */);
  } catch (error) {
    console.error(`❗ Error in command '${cmdName}':`, error);
    message.reply("There was an error executing that command.");
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Ticket System – Button Interactions
// ─────────────────────────────────────────────────────────────────────────────
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  // ─── Create Ticket ────────────────────────────────────────────────────────
  if (interaction.customId === "create_ticket") {
    // Prevent duplicates
    const existing = interaction.guild.channels.cache.find(
      (c) => c.name === `ticket-${interaction.user.username.toLowerCase()}`
    );
    if (existing) {
      return interaction.reply({
        content: `❗ You already have an open ticket: <#${existing.id}>`,
        ephemeral: true,
      });
    }

    // Role allowed to see all tickets
    const ticketManagerRole = interaction.guild.roles.cache.find(
      (r) => r.name.toLowerCase() === "ticket manager"
    );

    const permissionOverwrites = [
      {
        id: interaction.guild.roles.everyone.id,
        deny: ["ViewChannel"],
      },
      {
        id: interaction.user.id,
        allow: ["ViewChannel", "SendMessages", "ReadMessageHistory", "AttachFiles"],
      },
      {
        id: client.user.id,
        allow: ["ViewChannel", "SendMessages", "ManageChannels", "ReadMessageHistory"],
      },
    ];

    if (ticketManagerRole) {
      permissionOverwrites.push({
        id: ticketManagerRole.id,
        allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
      });
    }

    // Create channel
    const ticketChannel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username.toLowerCase()}`,
      type: ChannelType.GuildText,
      parent: TICKET_CATEGORY_ID,
      permissionOverwrites,
    });

    const embed = new EmbedBuilder()
      .setTitle(`🎟️ Ticket - ${interaction.user.username}`)
      .setDescription(
        "Support will be with you shortly.\nClick the button below to close this ticket when done."
      )
      .setColor("#00ADEF");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("close_ticket")
        .setLabel("❌ Close Ticket")
        .setStyle(ButtonStyle.Danger)
    );

    await ticketChannel.send({
      content: `<@${interaction.user.id}> ${ticketManagerRole ? `<@&${ticketManagerRole.id}>` : ""}`,
      embeds: [embed],
      components: [row],
    });

    return interaction.reply({
      content: `✅ Ticket created: <#${ticketChannel.id}>`,
      ephemeral: true,
    });
  }

  // ─── Close Ticket ─────────────────────────────────────────────────────────
  if (interaction.customId === "close_ticket") {
    await interaction.reply({
      content: "🔒 Ticket will be closed in 5 seconds...",
      ephemeral: true,
    });
    setTimeout(() => interaction.channel.delete().catch(console.error), 5000);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Log in to Discord
// ─────────────────────────────────────────────────────────────────────────────
client.login(process.env.BOT_TOKEN);
