//Variable Nexus
const Discord = require("discord.js");

const client = new Discord.Client();

const token = 'Please add token, only those trusted and authorized will be able to have access to the Token';

const prefix = "-";

const version = '1.0 Alpha';

const ytdl = require('ytdl-core');

const queue = new Map();


//Bot talking to the console/cmd
client.once("ready", () => {
    console.log("Abot is online!" + version);
});
client.once('reconnecting', () => {
    console.log('Reconnecting!');
});
client.once('disconnect', () => {
    console.log('Disconnect!');
});



//Conditional statement checking if the user is using a prefix
client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    //greeting message variables
    const greetings = ["I am Abot", "How's your day?", "You going to listen to some tunes?", "I'm kind of hungry...", "Life is good."];
    const random = Math.floor(Math.random() * greetings.length);

    const serverQueue = queue.get(message.guild.id);
    //conditional statement checking if the user is using the prefix first
    if (message.content.startsWith(`${prefix}play`)) {
        message.react('👍');
        execute(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}skip`)) {
        message.react('👉');
        skip(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}stop`)) {
        message.react('✋');
        stop(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}help`)) {
        message.react('💁‍♂️');
        message.channel.send('Hello, I am Abot! A music player for Discord. The commands I am able to process are -play **add link** / -skip / -stop')
    } else if (message.content.startsWith(`${prefix}hi`)) {
        message.channel.send('Hello, ' + greetings[random]);
    } else {
        message.react('😛');
        message.channel.send('Not a recognized command Baka! For more info try -help')
    }

});
//play command execute function. This also adds to the queue 5 max so far.
async function execute(message, serverQueue) {
    const args = message.content.split(" ");
    //added checker to see if there is a link
    if (!args[1]) {
        message.channel.send('Please enter a link!');
        return;
    }
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
        return message.channel.send(
            "You need to be in a voice channel to play music!"
        );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
            "I need the permissions to join and speak in your voice channel!"
        );
    }

    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
    };

    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };

        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message.guild, queueContruct.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        return message.channel.send(`${song.title} has been added to the queue!`);
    }
}
//skip function
function skip(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to skip the music!"
        );
    if (!serverQueue)
        return message.channel.send("There is no song that I could skip!");
    serverQueue.connection.dispatcher.end();

}
//stop function
function stop(message, serverQueue) {
    if (!serverQueue)
        return message.channel.send('There is nothing to stop... -_-');
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        );
    message.channel.send('Stopped the song and deleted the queue :)');
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}
//play function
function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Abot playing: **${song.title}** Enjoy!`);

}


// Below should be the last line of the script which takes the token to connect to the discord API
client.login(token);
