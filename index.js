const { Client , Collection , GatewayIntentBits , Discord , Events  , EmbedBuilder , PermissionsBitField, Guild, Embed } = require("discord.js");
const client = (global.client = new Client({ intents: [98303 , GatewayIntentBits.GuildPresences ,GatewayIntentBits.Guilds , GatewayIntentBits.GuildMessages , GatewayIntentBits.GuildPresences , GatewayIntentBits.GuildMessageReactions , GatewayIntentBits.DirectMessages , GatewayIntentBits.MessageContent ]}))
const dotenv = require("dotenv");
dotenv.config();
const { readdir } = require("fs");
require("moment-duration-format");
const db = require("quick.db");
const moment = require("moment");
moment.locale("tr");
const Config = require("./config.json");
const commands = client.commands = new Collection();
const aliases = client.aliases = new Collection();
client.cooldown = new Map();
client.commandblocked = [];

client.on('presenceUpdate', async (oldPresence, newPresence) => {
  const embed = new EmbedBuilder()
  const role = newPresence.guild.roles.cache.get(Config.System.ROL);
  const member = newPresence.member
  const activities = newPresence.activities[0];
  const kanal = newPresence.guild.channels.cache.get(Config.System.LOG)

  if (activities && (activities.state.includes(Config.System.URL))) { 
    kanal.send({embeds: [embed.setDescription(`${member} kullanıcısı durumuna \`${Config.System.URL}\` ekleyerek <@&${Config.System.ROL}> rolünü başarıyla aldı!`).setColor("Green")]})
    return newPresence.member.roles.add(role)
  } else {
    if(member.roles.cache.get(role.id)) {
      kanal.send({embeds: [embed.setDescription(`${member} kullanıcısından urlyi kaldırdığı için <@&${Config.System.ROL}> rolü alındı!`).setColor("Red")]})
      newPresence.member.roles.remove(role)
    }
  }
})

require("./src/helpers/function")(client);

readdir("./src/commands/", (err, files) => {
  if (err) console.error(err)
  files.forEach(f => {
    readdir("./src/commands/" + f, (err2, files2) => {
      if (err2) console.log(err2)
      files2.forEach(file => {
        let prop = require(`./src/commands/${f}/` + file);
        console.log(`[KAPTAN-COMMANDS] ${prop.name} is loaded!`);
        commands.set(prop.name, prop);
        prop.aliases.forEach(alias => {
          aliases.set(alias, prop.name);
        });
      });
    });
  });
});

readdir("./src/events", (err, files) => {
  if (err) return console.error(err);
  files.filter((file) => file.endsWith(".js")).forEach((file) => {
    let prop = require(`./src/events/${file}`);
    if (!prop.conf) return;
    client.on(prop.conf.name, prop);
    console.log(`[KAPTAN-EVENTS] ${prop.conf.name} is loaded!`);
  });
});  

client.login(Config.Main.botToken).then(() => console.log(`Logged in as ${client.user.username}!`)).catch((err) => console.log(`Error: ${err}`));