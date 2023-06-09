const client = global.client;
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Config = require("../../config.json");
const db = require("quick.db");
const ms = require('ms');

module.exports = async (message) => {


    if (!message.guild || message.author.bot) return

    const Kaptan = client.users.cache.get(Config.Main.botDeveloper);
    if (Config.Others.botPrefix && !message.content.startsWith(Config.Others.botPrefix)) return;
    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command) || [...client.commands.values()].find((e) => e.aliases && e.aliases.includes(command));
    const author = message.author
    const channel = message.channel
    const guild = message.guild
    const embed = new EmbedBuilder().setColor(message.member.displayHexColor).setAuthor({name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })}).setFooter({ text: `Kaptan tarafından geliştirildi.`, iconURL: Kaptan.displayAvatarURL({dynamic: true})})

    if (cmd) {
        if (cmd.owner && Config.Main.botDeveloper !== author.id) return;
        if (cmd.guildowner && Config.Main.botDeveloper !== author.id && guild.owner.id !== author.id) return;
        if (client.cooldown.has(author.id) === Config.Others.botCooldown) {
            client.commandblocked.push(author.id)
            message.reply({ embeds: [embed.setDescription(`${author} komutları kötüye kullandığın için engellendin.`)] });
        }
        if (client.commandblocked.includes(message.author)) return;
        cmd.execute(client, message, args, embed, author, channel, guild);
        if (Config.Main.botDeveloper !== author && guild.owner !== author) {
            if (!client.cooldown.has(author)) client.cooldown.set(author, 1);
            else client.cooldown.set(author.id, client.cooldown.get(author.id) + 1);
        }
        setTimeout(() => {
            if (client.cooldown.has(author.id)) {
                client.cooldown.delete(author.id)
            }
        }, 1000 * 60 * 5);
    }
}

module.exports.conf = {
    name: "messageCreate"
}