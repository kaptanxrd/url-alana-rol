const { Permissions } = require("discord.js");
const ms = require("ms");
module.exports = {
    name: "ping",
    aliases: ["pong", "neblm"],
    execute: async (client, message, args, embed, author, channel, guild) => {
       
    await message.reply(`${client.ws.ping}`)

}
};