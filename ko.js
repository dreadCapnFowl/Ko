const Discord = require('discord.js');
var mkdirp = require("mkdirp");
const fs = require("fs");
var imgur = require('imgur');
var download = require('download-file')
const client = new Discord.Client();
var sleep = require('sleep');
var shuffle = require('shuffle-array');
var timeAgo = require('node-time-ago');

const TOKEN = "token";
var cycleInterval = 1000 * 60 * 60 * 3;

function conf(value)
{
  return JSON.parse(fs.readFileSync('ko.conf'))[value]
}
function MakePostUpdate(client)
{
  console.log('Making #website post.')
  var files = fs.readdirSync('anime/')
/* now files is an Array of the name of the files in the folder and you can pick a random name inside of that array */
  let chosenFile = 'anime/' + files[Math.floor(Math.random() * files.length)]
    //.attachFile(chosenFile)
    imgur.uploadFile(chosenFile)
    .then(function (json) {

        var emb = new Discord.RichEmbed()
          .setColor('#ffccff')
          .setTitle('/trapan/')
          .setURL('https://trapan.net')
          .setAuthor('Official website', 'https://img.icons8.com/pastel-glyph/2x/like.png', 'https://trapan.net')
          .setDescription(`This is more than just a server. We're doing what we can to set up ways for you to network with like-minded individuals and have fun all around without competition!`)
          .setThumbnail('https://i.imgur.com/7Q912gx.png')
          .addField('About the site', conf("about_text"), false)
          .addField('Updates', conf("update_text"), true)
          .addField('To do:', conf("todo_text"), true)
          .addField('Support', conf("support_text"), true)
          .addField('Donate', `[Via PayPal (accepts credit card)](${conf("donate_url")})`, false)
          .setImage(json.data.link)
          .setFooter('(traps are not gay)', 'https://img.icons8.com/pastel-glyph/2x/like.png')
          .setTimestamp()
          client.channels.get(conf('updates_chan')).send(emb);

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
function PostWelcome(client)
{
  console.log('Making #welcome post.')

  var emb = new Discord.RichEmbed()
    .setColor('#ffccff')
    .setTitle('Welcome to /trapan/')
    .setURL('https://trapan.net')
    .setAuthor('admin team', 'https://img.icons8.com/pastel-glyph/2x/like.png', conf('invite'))
    .setDescription('Welcome to the holy immortal empire of Trapan! We have our own website as well as this server, feel free to look around and have fun ~ :black_heart:')
    .setThumbnail('https://i.imgur.com/7Q912gx.png')
    .setFooter(`take care ~ !`, 'https://img.icons8.com/pastel-glyph/2x/like.png')
    .setTimestamp()
    .addField('Access to channels', `> You can either wait until a mod sees what you have posted in <#${conf("gate_chan")}> and grants you <@&${conf("roles")["member"]}> manually, or you can go to the [trapan.net](https://trapan.net) and log in with your Discord account using the API to be automatically granted access.`, false)
    .addField('Getting around.', `> First be sure to see what\'s in <#${conf('rules_chan')}> to make sure you don\'t end up doing anything bad.\n> Check the <#${conf('updates_chan')}> channel for info on the website and recent updates.`, false)

    if (conf('ranks').length > 0)
    {
      var ranksStr = "> In case you're not able to get a role via posting pictures to get a colored name - here is a list of earnable ranks:\n\n";
      for (var i = 0; i < conf('ranks').length; i++)
      {
        ranksStr += `**\`${conf('ranks')[i]['invites']}\`** invites <@&${conf('ranks')[i]['id']}> role.\n`;
      }
      emb.addField('Invite rank list', ranksStr, false);
    }
    client.channels.get(conf('welcome_chan')).send(emb);
}
function PostRules(client)
{
  console.log('Making #rules post.')
  var conf = JSON.parse(fs.readFileSync('ko.conf'));

  var emb = new Discord.RichEmbed()
    .setColor('#ffccff')
    .setTitle('Rules of /trapan/')
    .setURL('https://trapan.net')
    .setAuthor('admin team', 'https://img.icons8.com/pastel-glyph/2x/like.png', conf['invite'])
    .setDescription('These are the rules of this server. Do not break them. Report any violations to the <@&650497704945778688> team.')
    .setThumbnail('https://i.imgur.com/7Q912gx.png')
    .setFooter('all hail the Trapanese empire!', 'https://img.icons8.com/pastel-glyph/2x/like.png')
    .setTimestamp()

    if (conf['rules'].length > 0)
    {
      var rulesStr = "";
      for (var i = 0; i < conf['rules'].length; i++)
      {
        rulesStr += "**" + (i+1) + ".** " + conf['rules'][i] + '\n';
      }
      emb.addField('List', rulesStr, false);
    }
    emb.addField('Access to channels', "You can either wait until a mod evaluates you and grants you <@&650501350840467467> manually, or you can go to the [website](https://trapan.net) and log in with your Discord account using the API to be automatically granted access.", false);
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
function MakeWelcomeUpdate(client)
{
  var conf = JSON.parse(fs.readFileSync('ko.conf'));

        client.channels.get(conf['welcome_chan']).fetchMessages({ limit: 1 }).then(messages => {
            let lastMessage = messages.first();
            if (lastMessage)
            {

              lastMessage.delete().then(r => {
                PostWelcome(client);
              }).catch(e =>
              {
                console.log(e)
              })
            }
            else {
              PostWelcome(client);
            }

        })
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
  client.channels.get('650500008948531230').send(n)
}

client.on("guildMemberUpdate", function(oldMember, newMember){

  // If gain member role ping in general
  var memberRoleId = conf('roles')['member'];
  if (!oldMember.roles.has(memberRoleId) && newMember.roles.has(memberRoleId)) {

    client.fetchUser(newMember.id).then(usr => {
        /*
        var emb = new Discord.RichEmbed()
          .setColor('#ffccff')
          .setTitle('Member approved')
          .setDescription('Welcome to /trapan/, <@'+newMember.id+'>')
          .setThumbnail(usr.avatarURL);
          client.channels.get(announceChannel).send(emb);
          */
          var emb = new Discord.RichEmbed()
            .setColor('#6600cc')
            .setTitle(`New member!`)
            .setDescription(`<@${usr.id}> has just joined!\nPlease be nice to them, they only joined Discord ${timeAgo(usr.createdAt)}.`)
          //.setThumbnail(`	https://cdn.discordapp.com/avatars/${usr.id}/${usr.avatar}.png`);
          if (usr.avatar)
            emb.setThumbnail(`	https://cdn.discordapp.com/avatars/${usr.id}/${usr.avatar}.png`);

          client.channels.get(conf('announce_chan')).send(
            emb
          )

          client.channels.get(conf('welcome_chan')).createInvite({
            maxAge: 0, //maximum time for the invite, in milliseconds
            maxUses: 0 //maximum times it can be used
          }, `On member role update.`).then(inv => {
            var invurl = 'https://discord.gg/' + inv.code;
            var emb = new Discord.RichEmbed()
              .setColor('#ffccff')
              .setTitle(newMember.guild.name)
              .setURL(invurl)
              .setDescription(`Your membership in has been approved!`)
              .addField(`You're in!`, `You have just been granted access to [${newMember.guild.name}](${invurl})\n(click to autojump to server)`)
              .addField(`Don't be shy!`, 'If you get this message feel free to pop in and chat with our friendly community, however, try to not idle too much, because ')
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
  MakeWelcomeUpdate(client)
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
client.on("guildMemberAdd", async (member) => {

  /*
  InviteManager integration
  Call invitemanager's last sent message to see who invited the joinee.
  */
  //var invman = await client.fetchUser('409875566800404480');


  setTimeout(async function() {
    var createdago = timeAgo(member.user.createdAt);
    var emb = new Discord.RichEmbed()
      .setColor('#FF00FF')
      .setTitle(`Welcome to /trapan/, ${member.user.username}!`)
      .setDescription(`Please type something in the chat so the moderator can see that you're not an evil bot and let you in!\nBe patient, please!`)

    var details = `I see that you registered ${createdago}.`;
    if (conf('invitemanager')['enabled'])
    {
        try {
          var invman_chan = client.channels.get(conf('invitemanager')['join_channel']);

          messages = await invman_chan.fetchMessages()
          var invman_msgs = messages.filter(msg => msg.author.id == conf('invitemanager')['bot_id'])

          var msgs = invman_msgs.array().slice(0, 5).reverse();
          var found = false;
          for (var i = 0; i < msgs.length; i++)
          {
            var mc = msgs[i].content;
            var invitee = mc.substring(mc.indexOf('<@')+2, mc.indexOf('>'));
            var invitername = mc.substring(mc.indexOf('by **')+5, mc.indexOf('** ('))
            var numinvites = mc.substring(mc.indexOf('(**')+3, mc.indexOf('** invites'))

            let inviterid = client.users.find(u => u.username === invitername);
            if (invitee == member.user.id)
            {
              details += `\nPossibly invited by ${inviterid} (${numinvites} invites)`
              break;
            }
          }
        } catch(e) {
            client.channels.get(conf('invitemanager')['admin_channel']).send(member.user.username + ': ' + e)
        }


    }
    emb.addField(`Details`, details)

    if (!member.user.avatar)
    {
      emb.addField('Warning!', `Profile pictures are mandatory! Please get one and let us know or you will not be let in. It's in the <#${conf('rules_chan')}>.`)
    }
    var gatechan = client.channels.get(conf('gate_chan'))
    gatechan.send(emb);
    gatechan.send(
      `<@${member.id}>`
    )
  }, conf('invitemanager')['enabled'] ? 5000 : 0)
})
let sendAllTimeout;
var ignorechans = [
];
client.on('message', async msg => {
  if (msg.author.bot)
    return;

  if (msg.author.id== JSON.parse(fs.readFileSync('ko.conf'))['owner_id'] && msg.guild == null)
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

    /*
  if (msg.channel.id == JSON.parse(fs.readFileSync('ko.conf'))['gate_chan'] &&
      msg.author.avatar == null)
  {
    msg.reply('Please get a profile picture.');
  }
  */

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
