const Discord = require('discord.js');
var mkdirp = require("mkdirp");
const fs = require("fs");
var imgur = require('imgur');
var download = require('download-file')
const client = new Discord.Client();
var sleep = require('sleep');
var shuffle = require('shuffle-array');

const TOKEN = "YOUR TOKEN HERE";
var cycleInterval = 1000 * 60 * 60 * 3;
function MakePostUpdate(client)
{
  console.log('Making #website post.')
  var files = fs.readdirSync('anime/')
/* now files is an Array of the name of the files in the folder and you can pick a random name inside of that array */
  let chosenFile = 'anime/' + files[Math.floor(Math.random() * files.length)]
    //.attachFile(chosenFile)
    imgur.uploadFile(chosenFile)
    .then(function (json) {

        var conf = JSON.parse(fs.readFileSync('ko.conf'));

        var emb = new Discord.RichEmbed()
          .setColor('#ffccff')
          .setTitle('/trapan/')
          .setURL('https://trapan.net')
          .setAuthor('Donate', 'https://img.icons8.com/pastel-glyph/2x/like.png', 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=X8GB9BW76N9VQ&source=url')
          .setDescription('Official website of the server.')
          .setThumbnail('https://i.imgur.com/7Q912gx.png')
          .addField('Updates', conf["update_text"], false)
          .addField('To do:', conf["todo_text"], false)
          .addField('About', conf["about_text"], true)
          .addField('Support', conf["support_text"], true)
          .addField('Donate', "[Via PayPal or card (through PayPal)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=X8GB9BW76N9VQ&source=url)", false)
          .setImage(json.data.link)
          .setFooter('site admin: sadcode#6298', 'https://img.icons8.com/pastel-glyph/2x/like.png')
          .setTimestamp()
          client.channels.get(conf['updates_chan']).send(emb);

    })
    .catch(function (err) {
        console.error(err.message);
    });
    //var file = new Discord.Attachment(chosenFile)

    /*
    client.channels.get(refreshLinkChan).send({files:[file], embed: emb}).then((msg)=> {
      console.log("Link updated.")
    }).catch( e => {
      console.log(e)
    });
    */
}

function PostRules(client)
{
  console.log('Making #rules post.')
  var conf = JSON.parse(fs.readFileSync('ko.conf'));

  var emb = new Discord.RichEmbed()
    .setColor('#ffccff')
    .setTitle('/trapan/')
    .setURL('https://trapan.net')
    .setAuthor('Dark Overlord', 'https://img.icons8.com/pastel-glyph/2x/like.png', conf['invite'])
    .setDescription('Welcome to the holy immortal empire of Trapan! We have our own website as well as this server, feel free to look around and have fun ~:heart:')
    .setThumbnail('https://i.imgur.com/7Q912gx.png')
    .setFooter('all hail the Dark Overlord, leader of the Trapanese empire', 'https://img.icons8.com/pastel-glyph/2x/like.png')
    .setTimestamp()

    if (conf['rules'].length > 0)
    {
      var rulesStr = "";
      for (var i = 0; i < conf['rules'].length; i++)
      {
        rulesStr += "**" + (i+1) + ".** " + conf['rules'][i] + '\n';
      }
      emb.addField('Rules', rulesStr, false);
    }
    emb.addField('Access to channels', "You can either wait until a mod evaluates you and grants you <@&639020993880260629> manually, or you can go to the [website](https://trapan.net) and log in with your Discord account using the API to be automatically granted access.", false);
    client.channels.get(conf['rules_chan']).send(emb);
}
function MakeRulesUpdate(client)
{
  var conf = JSON.parse(fs.readFileSync('ko.conf'));

        client.channels.get(conf['rules_chan']).fetchMessages({ limit: 1 }).then(messages => {
            let lastMessage = messages.first();
            if (lastMessage)
            {
              lastMessage.delete().then(r => {
                PostRules(client);
              }).catch(e =>
              {
                console.log(e)
              })
            }
            else {
              PostRules(client);
            }

        })
        var conf = JSON.parse(fs.readFileSync('ko.conf'));
}
function Cycle()
{
  var conf = JSON.parse(fs.readFileSync('ko.conf'));
  client.channels.get(conf['updates_chan']).fetchMessages({ limit: 1 }).then(messages => {
      let lastMessage = messages.first();
      if (lastMessage)
      {
        lastMessage.delete().then(r => {
          MakePostUpdate(client);
        }).catch(e =>
        {
          console.log(e)
        })
      }
      else {
        MakePostUpdate(client);
      }

  })
}
function pruneMembers()
{
  var guild = client.guilds.get('639019984974118923');
  console.log("Checking " + guild.memberCount + " members.");
  guild.members.forEach(m => {
      console.log(m);
  })
}
async function msgAllUsers()
{
    var conf = JSON.parse(fs.readFileSync('ko.conf'));
    var guild = client.guilds.get('639019984974118923');
    var p = Array.from(guild.presences);
    shuffle(p);
    var botm = await client.fetchUser(conf["owner_id"]);
    await botm.send('Sending prune warning to '+p.length+' users.');

    for (var i = 0; i < p.length; i++)
    {
      var u = await client.fetchUser(p[i][0]);

      var emb = new Discord.RichEmbed()
      .setColor('#FF00FF')
      .setTitle('/trapan/')
      .setURL(conf['invite'])
      .setAuthor('friendly message from', 'https://www.iconsdb.com/icons/preview/barbie-pink/message-outline-xxl.png', conf['invite'])
                	//.setDescription('message for ' + usr.username)
      .addField('Dear ' + u.username + ',', conf['send_all_text'] + '\n\n\n\n' + '[Click here to shortcut to server.]('+conf['invite']+')')
                	//.setImage('https://i.imgur.com/wSTFkRM.png')
      .setImage('https://i.imgur.com/7Q912gx.png')
      .setFooter('~ /trapan/', 'https://www.iconsdb.com/icons/preview/barbie-pink/message-outline-xxl.png');


      try {
        //await botm.send(u.username + ' ' + i + '/' + p.length);
        console.log(u.username + ' ' + i + '/' + p.length);
        await u.send(emb);
        sleep.sleep(3);
      } catch (e) {
        console.log('Error ' + e);
        sleep.sleep(10);
      }
    }

}
async function dmAllUsers(message)
{
    var conf = JSON.parse(fs.readFileSync('ko.conf'));
    var guild = client.guilds.get('639019984974118923');
    var p = Array.from(guild.presences);
    shuffle(p);
    var botm = await client.fetchUser(conf["owner_id"]);
    await botm.send('Sending message warning to '+p.length+' users.');

    for (var i = 0; i < p.length; i++)
    {
      var u = await client.fetchUser(p[i][0]);

      var emb = new Discord.RichEmbed()
      .setColor('#FF00FF')
      .setTitle('/trapan/')
      .setURL(conf['invite'])
      .setAuthor('friendly message from', 'https://www.iconsdb.com/icons/preview/barbie-pink/message-outline-xxl.png', conf['invite'])
                	//.setDescription('message for ' + usr.username)
      .addField('Dear ' + u.username + ',', message + '\n\n\n\n' + '[Click here to shortcut to server.]('+conf['invite']+')')
                	//.setImage('https://i.imgur.com/wSTFkRM.png')
      .setImage('https://i.imgur.com/7Q912gx.png')
      .setFooter('~ /trapan/', 'https://www.iconsdb.com/icons/preview/barbie-pink/message-outline-xxl.png');


      try {
        //await botm.send(u.username + ' ' + i + '/' + p.length);
        console.log(u.username + ' ' + i + '/' + p.length);
        await u.send(emb);
        sleep.sleep(3);
      } catch (e) {
        console.log('Error ' + e);
        sleep.sleep(10);
      }
    }

}
function msgRandomUser(guild)
{
  var p = Array.from(guild.presences);
  var uid = p[Math.floor(Math.random()*p.length)][0];
  //var u = guild.members.random();
  var conf = JSON.parse(fs.readFileSync('ko.conf'));

    client.fetchUser(uid).then(usr => {
  //var u = client.fetchUser('618185734024593419').then(usr => {
      //console.log(guild.name)
      console.log('Messaging on ' + guild.name + '('+guild.members.size+') users; user: ' + usr.username)
      var emb = new Discord.RichEmbed()
      	.setColor('#FF00FF')
      	.setTitle('/trapan/')
      	.setURL(conf['invite'])
      	.setAuthor('by sadcode', 'https://www.iconsdb.com/icons/preview/barbie-pink/message-outline-xxl.png', conf['invite'])
      	//.setDescription('message for ' + usr.username)
      	.addField('Dear ' + usr.username + ',', 'please consider this message')
        .addField('Activity', 'In order to keep out undesireables this server imposes an activity timeout. Please post in the server in order to avoid getting pruned.', true)
      	.addField('Invites', 'We keep track of invites and give rewards to people who invite others to this server. Not only would it help the server to grow if you invited friends, but that way we can know that safe people are being invited. Please be a friend and invite someone you know :heart:\n\nPlease use this invite: ' + conf['invite'], true)
      	//.setImage('https://i.imgur.com/wSTFkRM.png')
      	.setTimestamp()
        .setImage('https://i.imgur.com/7Q912gx.png')
      	.setFooter('~ /trapan/', 'https://www.iconsdb.com/icons/preview/barbie-pink/message-outline-xxl.png');

      usr.send(emb);
      console.log('Sent message to ' + usr.username);
  }).catch(e => {
    console.log(e)
  });

}
function nword()
{
  var n = "";
  for (var i = 0; i < 50; i++)
  {
    n += "nigger "
  }
  client.channels.get('643277334299803649').send(n)
}

client.on("guildMemberUpdate", function(oldMember, newMember){

  // If gain member role ping in general
  var memberRoleId = '639020993880260629';
  var announceChannel = '643277336309137448';
  if (!oldMember.roles.has(memberRoleId) && newMember.roles.has(memberRoleId)) {


      var conf = JSON.parse(fs.readFileSync('ko.conf'));
      client.fetchUser(newMember.id).then(usr => {
        /*
        var emb = new Discord.RichEmbed()
          .setColor('#ffccff')
          .setTitle('Member approved')
          .setDescription('Welcome to /trapan/, <@'+newMember.id+'>')
          .setThumbnail(usr.avatarURL);
          client.channels.get(announceChannel).send(emb);
          */
          client.channels.get(conf['announce_chan']).send(
            '<@' + newMember.id + '> has just joined!\nPlease be nice to them!'
          )
          client.channels.get(conf['rules_chan']).createInvite({
            maxAge: 0, //maximum time for the invite, in milliseconds
            maxUses: 0 //maximum times it can be used
          }, `On member role update.`).then(inv => {
            var invurl = 'https://discord.gg/' + inv.code;
            var emb = new Discord.RichEmbed()
              .setColor('#ffccff')
              .setTitle('/trapan/')
              .setURL(invurl)
              .setDescription(`Your membership in has been approved!\nClick [here](${invurl}) to jump to the server.\n\nHave a nice stay!\n\nPlease invite your friends using this invite :heart:\n> ${invurl}`)
              .setThumbnail(newMember.guild.iconURL);
              usr.send(emb);
          })

      /*
      .then(inv => {
        var emb = new Discord.RichEmbed()
          .setColor('#ffccff')
          .setTitle('/trapan/')
          .setURL(inv)
          .setDescription('Your membership in has been approved!\nClick [here]('+${inv}+') to jump to the server.\n\nHave a nice stay!\n\nPlease invite your friends using this invite :heart:\n> ' + invite)
          .setThumbnail(newMember.guild.iconURL);
          usr.send(emb);
      }).catch(console.log));
      */
      });
  }
});

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  nword()
  setInterval(nword, 1000*60)

  Cycle()
  setInterval(Cycle, cycleInterval);

  //pruneMembers();
  //setInterval(pruneMembers, 1000 * 60 * 60);

  MakeRulesUpdate(client)
  // Start timer to message a random user.
  console.log(client.guilds.size + " servers.")

  /*
  var offset = 0;
  client.guilds.forEach(function (g) {
    msgRandomUser(g)
    setInterval(function() {
      msgRandomUser(g)
    }, 1000 * 60 * 60 * 1 + offset)
    offset += 5 * 1000;
  })
  */
  // Message all msgAllUsers
  //setTimeout(msgAllUsers, 1);
});
client.on("guildMemberAdd", (member) => {
  client.channels.get(JSON.parse(fs.readFileSync('ko.conf'))['gate_chan']).send(
    'Welcome, <@' + member.id + '>!\nPlease read <#' +JSON.parse(fs.readFileSync('ko.conf'))['rules_chan']+'> and have fun!\n\nType something in this chat to prove you are not a bot and moderator will approve you shortly.'
  )
})
let sendAllTimeout;
var ignorechans = [
  '643277332219691029',
  '643277332945174538',
  '643277334299803649',
  '643277346341781521',
  '643277352935227392'
];
client.on('message', async msg => {
  if (msg.author.bot)
    return;

  if (msg.author.id=='643310077763387392' && msg.guild == null)
  {
    if (msg.content == "purgewarn")
    {
      //setTimeout(msgAllUsers, 1);
      await msgAllUsers();
    } else
    if (msg.content == "die")
    {
      msg.reply('Exiting.')
      .then(sent => process.exit(0) )

    } else
    if (msg.content == "ping")
    {
      msg.reply("Pong!");
    } else
    if (msg.content == "help")
    {
      msg.reply(`purgewarn - messages everyone at 5 second interval.\n\
die - exits the bot.\n\
ping - pong\n\
dmall [message] - DMs everyone with a message.\n`);
} else
    if (msg.content.split(' ')[0] == "dmall")
    {
      await dmAllUsers(msg.content.split(' ').slice(1).join(' ').replace('\\n', '\n'));
    }
  }

  if (msg.guild == null)
    return;


  if (msg.channel.id == JSON.parse(fs.readFileSync('ko.conf'))['gate_chan'] &&
      msg.author.avatar == null)
  {
    msg.reply('Please get a profile picture.');
  }

  // Timeout cleared
  if (!ignorechans.includes(msg.channel.id))
  {
    clearTimeout(sendAllTimeout);
    sendAllTimeout = setTimeout(msgAllUsers, 1000 * 60 * 60 * 1);
  }

  if (!fs.existsSync('./Ko/'+msg.guild.id)) {
    mkdirp('./Ko/'+msg.guild.id, function(err) {
      if (err) console.log(err)
    });
  }

  if (!fs.existsSync('./Ko/'+msg.guild.id+'/'+msg.channel.id)) {
    mkdirp('./Ko/'+msg.guild.id+'/'+msg.channel.id, function(err) {
      if (err) console.log(err)
    });
  }

  msg.attachments.forEach(function(a){
    var url = a.url

    var options = {
        directory: './Ko/'+msg.guild.id+'/'+msg.channel.id,
        filename: a.filename
    }

    download(url, options, function(err){
        if (err) throw err
        console.log(a.filename + '@'+msg.guild.name+'@'+msg.channel.name)
    })
  })
});

client.login(TOKEN);
