const { exit } = require('node:process');

// require the necessary discord.js modules
const { Client, Collection, Intents } = require('discord.js');

// load in required modules for logging and filesystem manipulation
const fs = require('node:fs');

// load the unique, secure, super secret token from the config.json file...
const { token } = require('../config.json');

if ( process.argv.indexOf('--quiet') != -1) {
	require('log-timestamp');
} else {
	console.log('Binding console to 127.0.0.1:5656');
	require('./http-logger.js') (() => {
		return '[' + new Date() + '] %s';
	});
}


// create a new client instance, this represents our bot in code or bot is a client connecting to a discord server
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });



/*************************************/
/* L O A D  C O M M A N D  F I L E S */
/*************************************/

// the following will search for all commands in ./commands and load them as modules


// attach a new collection that will hold commands to client
client.commands = new Collection();

// load files from the dir ./commands using filter
// filter to only javascript files (ends with '.js')

console.log('Loading commands...');

const commandFiles = fs.readdirSync('../commands').filter(file => file.endsWith('.js'));

// loop thru all the files
for (const file of commandFiles) {

	// load the file (module) into command
	const command = require(`../commands/${file}`);
	console.log(`SUCCESS : ${file}`);

	// set a new item in the collection
	// with the command name as the key and the exported module (code to execute) as the value
	client.commands.set(command.data.name, command);
}



/*********************************/
/* L O A D  E V E N T  F I L E S */
/*********************************/

// same exact concept as the section above that reads command files!
// except for...
function loadEvents(client, path)
{
	if (!fs.existsSync(path))
	{
		console.log(`${path} not found, skipping...`)
		return 1; // early exit if the specified path does not exist
	}

	const eventFiles = fs.readdirSync(path).filter(file => file.endsWith('.js'));

	for (const file of eventFiles) {
		const event = require(`${path}/${file}`);

		console.log(`SUCCESS : ${path}/${file}`)

		// THE FOLLOWING! We aren't loading commands we are creating event listeners...
		// that means we are linking events, by name, to code that will be executed once the event occurs
		// the name, whether it can run multiple times, and the code to execute are all contained in each file per event
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	}

	return 0;
}

/*	FURTHER EXPLANATION OF EVENT MODULES AND THEIR COMPONENTS
The event modules we are loading have a very specific structure to them
They all have three components (key/value pairs): name, once, and execute

name -
this is where we specify the type of event by name that we are registering a function for
when an event occurs it notifies our bot of the type of event it is by name
if there is an event of this type registered with our bot (client) then it will call the appropriate function

once -
a boolean(true/false) telling the bot whether it can respond to this type of event 

execute -
the function that is to be executed upon this event occurring	*/

console.log('Loading events...')
loadEvents(client, '../events');

if (loadEvents(client, './events') != 0)
{
	console.log(`FATAL: './events' not found unable to continue, exiting...`);
	exit();
}



// login to Discord with your client's token
client.login(token);
