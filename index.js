require("dotenv").config();

const mongoose = require('C:/Users/R_a_g/OneDrive/Documents/code/js/discordjs/elitex-support/mongodb/mongoose.js')

;const { Intents,Client,Collection} = require('discord.js');

const { REST } = require('@discordjs/rest');

const { Routes } = require('discord-api-types/v9');

const fs = require('fs');

const slash_command_files = fs.readdirSync("./slashcommands").filter((filter) => filter.endsWith('.js') );

const event_files = fs.readdirSync('./events').filter((filter) => filter.endsWith('.js'));

const slash_commands_arr=[];

const intents = new Intents(32767);

const client = new Client({
    intents: intents
});

client.slash_commands = new Collection();

///////////////////////////////////////////////     Slash Command handler      /////////////////////////////////////
for (let f of slash_command_files)
{
    const file = require(`C:/Users/R_a_g/OneDrive/Documents/code/js/discordjs/elitex-support/slashcommands/${f}`)
    slash_commands_arr.push(file.data.toJSON());

    console.log(`Loaded Slash Command ${file.data.name}`);
    client.slash_commands.set(file.data.name, file)    

}

//////////////////////////////////////////////      Event Handler       ///////////////////////////////////////////
for (let e of event_files)
{   
    
    const event = require(`C:/Users/R_a_g/OneDrive/Documents/code/js/discordjs/elitex-support/events/${e}`);
    console.log(`Loaded Event ${e} Successfully`);
    client.on(event.name,(args) => event.execute(client,args));

}


/////////////////////////////////////////////       Registration       //////////////////////////////////////////////////
var token = process.env.token;

client.once('ready', () => {
let CLIENT_ID = client.user.id;
        const rest = new REST({                         //obj creation for REST class
            version: "9"
        }).setToken(token);
        
        (async () => 
        {
            try 
            {
                if (process.env.ENV === "production")
                {
                    await rest.put(Routes.applicationCommands(CLIENT_ID),
                    {
                        body: slash_commands_arr   //arr
                    });
                    console.log("Production mode");
    
                }
    
                else 
                {
                    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID),
                    {
                        body: slash_commands_arr, //arr
                    });
                    console.log("Maintenance mode");
                    
                }
            }
            catch(err)
            {   
                console.log("An error occurred in ready() main file...Displaying it now...")
                console.log(err);
            }
    
        })();
});


//////////////////////////////////////////////////////////  MongoDB  ///////////////////////////////////////////////////////////////

mongoose.login();


client.login(token);