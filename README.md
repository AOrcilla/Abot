# Abot
A local discord bot that joins a voice channel and plays youtube links as audio (Music player)

# Instructions
To use this bot you must use the link provided by the admin to add it to a server. This Bot is ran locally and will only work if the admin is running the code through a CLI.

Once the Bot has joined the server it will accept any of these commands followed by the prefix "-"
1. -help will display the available commands that Abot will accept.
2. -play **insert youtube link** makes Abot join a voice channel and play the youtube link following the command. **NOTE** The command will only work if a user is in a voice channel as the bot maps to the channel the user who ran the command is on. If you enter the command again as a link is already playing it will add it to a queue to play once the link is done. Currently the queue can hold a max of 3. 
3. -skip Abot will skip to the next song in queue. If you skip the last song in the queue Abot will disconnect from voice.
4. -stop will stop Abot from playing and disconnect it from the voice channel.
