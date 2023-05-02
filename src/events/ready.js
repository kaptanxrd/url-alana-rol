const Config = require("../../config.json");
const { joinVoiceChannel } = require("@discordjs/voice");
const db = require("quick.db")
const {Discord, ActivityType} = require("discord.js")
const client = global.client;

module.exports = () => {
    setInterval(() => {
        const oynuyor = Config.Others.botStatus;
        const index = Math.floor(Math.random() * (oynuyor.length));
  
        client.user.setPresence({
              activities: [
                  {
                      name: `${oynuyor[index]}`,
                      type: ActivityType.Streaming,
                      url: `https://twitch.tv/kaptanxrd`
                       }
              ],
          });
      }, 5000);
    
}

module.exports.conf = {
    name: "ready"
}
