const { TextChannel, EmbedBuilder } = require("discord.js");
const Config = require("../../config.json");
const moment = require("moment");
moment.locale("tr");

module.exports = async client => {
    client.fetchUser = async (userID) => {
        try {
            return await client.users.fetch({ message: userID});
        } catch (err) {
            return undefined;
        }
    };

    TextChannel.prototype.error = async function (message, text) {
        const author = message.author
        const Kaptan = client.users.cache.get(Config.Main.botDeveloper);
        const embed = new EmbedBuilder()
        .setColor(message.member.displayHexColor)
        .setAuthor({name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
        .setFooter({ text: `Kaptan tarafından geliştirildi.`, iconURL: Kaptan.displayAvatarURL({dynamic: true})})
        this.send({ embeds: [embed.setDescription(text)] }).then(x => { if (x.deletable) setTimeout(() => { x.delete(); }, 10000) });
    };
}