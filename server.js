/*

  _____  ______          _____  __  __ ______   __  __ _____  
 |  __ \|  ____|   /\   |  __ \|  \/  |  ____| |  \/  |  __ \ 
 | |__) | |__     /  \  | |  | | \  / | |__    | \  / | |  | |
 |  _  /|  __|   / /\ \ | |  | | |\/| |  __|   | |\/| | |  | |
 | | \ \| |____ / ____ \| |__| | |  | | |____ _| |  | | |__| |
 |_|  \_\______/_/    \_\_____/|_|  |_|______(_)_|  |_|_____/ 
                                                              
  __  __ _    _ _______ _               _  __          
 |  \/  | |  | |__   __| |        /\   | |/ /    /\    
 | \  / | |  | |  | |  | |       /  \  | ' /    /  \   
 | |\/| | |  | |  | |  | |      / /\ \ |  <    / /\ \  
 | |  | | |__| |  | |  | |____ / ____ \| . \  / ____ \ 
 |_|  |_|\____/   |_|  |______/_/    \_\_|\_\/_/    \_\
                                                       
   ____  _  ___    _  _ 
  / __ \| |/ / |  | | |
 | |  | | ' /| |  | | |
 | |  | |  < | |  | | |
 | |__| | . \| |__| |_|
  \____/|_|\_\\____/(_)
                       

*/
const ReactionRole = require("reaction-role");
const BookmanDB = require("bookman");
const reactionRole = new ReactionRole.Main("TOKEN");
const client = reactionRole.Client();
client.config = {
  prefix: "botun prefixi",
  db: new BookmanDB("lozbey")
}
reactionRole.init();

client.on("ready", () => {
  console.log(`[BOT] ${client.user.username} çevrimiçi!`);
  client.user.setActivity(`${client.config.prefix}oluştur | Emoji ile rol alma sistemi!`)
  let systems = client.config.db.get("lozbey");
  for (let lozbey in systems) {
    lozbey = systems[lozbey];
    let option = reactionRole.createOption(lozbey.emoji, lozbey.role)
    reactionRole.createMessage(lozbey.message, lozbey.channel, option);
    reactionRole.reInit();
  }
});

client.on("message", lozbey => {
  if (!lozbey.content.startsWith(client.config.prefix) || lozbey.author.bot) return;
  const args = lozbey.content.slice(client.config.prefix.length).split(' ');
  const command = args.shift().toLowerCase();
  if (command == "oluştur") {
    if (!args[0]) return lozbey.channel.send("Bir kanal ID belirtin.");
    if (!args[1]) return lozbey.channel.send("Bir mesaj ID belirtin.");
    if (!lozbey.mentions.roles.first()) return lozbey.channel.send("Bir role etiketleyin.");
    if (!args[3]) return lozbey.channel.send("Bir emoji belirtin.");
    let option = reactionRole.createOption(args[3], lozbey.mentions.roles.first().id)
    reactionRole.createMessage(args[1], args[0], option);
    reactionRole.reInit();
    let obj = {
      channel: args[0],
      message: args[1],
      role: lozbey.mentions.roles.first().id,
      emoji: args[3]
    }
    client.config.db.set(`lozbey.${args[0]}`, obj);
    lozbey.channel.send("Sistem Başarılı Bir Şekilde Kuruldu.");
  }
});