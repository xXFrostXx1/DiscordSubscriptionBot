const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.commands = new Collection();
client.cooldowns = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const loadCommands = () => {
    try {
        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);
            client.commands.set(command.data.name, command);
        }
    } catch (error) {
        console.error("Error loading a command file: ", error);
    }
};

loadCommands();

client.once('ready', () => {
    console.log('Ready!');
});

client.on('messageCreate', async message => {
    if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

    const args = message.content.slice(process.env.PREFIX.length).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.data.aliases && cmd.data.aliases.includes(commandName));

    if (!command) {
        message.reply('Command does not exist.');
        return;
    }

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(`There was an error trying to execute command ${commandName}: `, error);
        message.reply(`An error occurred while executing that command. Please try again later.`);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        await interaction.reply({ content: 'Command not found.', ephemeral: true });
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`Error executing command ${interaction.commandName}: `, error);
        await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
    }
});

client.login(process.env.TOKEN);