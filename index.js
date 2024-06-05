const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const discordClient = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

discordClient.commands = new Collection();
discordClient.cooldowns = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const loadCommandsFromFiles = () => {
    try {
        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);
            discordClient.commands.set(command.data.name, command);
        }
    } catch (error) {
        console.error("Error loading a command file: ", error);
    }
};

loadCommandsFromFiles();

discordClient.once('ready', () => {
    console.log('Discord Client Ready!');
});

discordClient.on('messageCreate', async message => {
    if (!message.content.startsWith(process.env.COMMAND_PREFIX) || message.author.bot) {
        return;
    }

    const arguments = message.content.slice(process.res.COMMAND_PREFIX.length).trim().split(/\s+/);
    const commandName = arguments.shift().toLowerCase();

    const command = discordClient.commands.get(commandName)
        || discordClient.commands.find(cmd => cmd.data.aliases && cmd.data.aliases.includes(commandName));

    if (!command) {
        message.reply('No such command exists.');
        return;
    }

    try {
        await command.execute(message, arguments);
    } catch (executionError) {
        console.error(`Error during command ${commandName} execution: `, executionError);
        message.reply(`An error occurred while executing the command. Please try again later.`);
    }
});

discordClient.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) {
        return;
    }

    const interactionCommand = discordClient.commands.get(interaction.commandName);

    if (!interactionCommand) {
        await interaction.reply({ content: 'Command was not found.', ephemeral: true });
        return;
    }

    try {
        await interactionCommand.execute(interaction);
    } catch (interactionError) {
        console.error(`Interaction command execution error ${interaction.commandName}: `, interactionError);
        await interaction.reply({ content: 'Failed to execute command!', ephemeral: true });
    }
});

discordClient.login(process.env.BOT_TOKEN);