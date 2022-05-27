// 'interactionCreate' this event is called when someone interacts with the bot 

// module.exports allows us to use require('interactionCreate.js') to load this chunk of code into a variable in another file
module.exports = {
	name: 'interactionCreate',		// the name of the event to register this module to

	// the following is an async function that will log info about the interaction and handle the interaction response
	async execute(interaction) {

		// log out to the console information about this interaction
		console.log(`User in #${interaction.channel.name} triggered a(n) ${interaction.type}: ${interaction.commandName}`);

		// early exit if interaction isn't a command
		if (!interaction.isCommand()) return;

		// pulls the command module from the collection of commands in client (accesible through interaction.client.commands)
		const command = interaction.client.commands.get(interaction.commandName);

		// early exit if the command doesn't exist in the collection
		if (!command) return;

		// attempt to execute the module passing in the interaction as the sole argument
		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
};
