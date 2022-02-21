const fs = require('fs');
const ticket_no = require('../mongodb/ticket_no');
const close_ticket = require("C:/Users/R_a_g/OneDrive/Documents/code/js/discordjs/elitex-support/process/close-ticket.js")
const process=fs.readdirSync("C:/Users/R_a_g/OneDrive/Documents/code/js/discordjs/elitex-support/process/").filter((filter) => filter.endsWith(".js"));

module.exports = {

    name: "interactionCreate",

    async execute(client,interaction)
    {   
        if (interaction.isButton()) 
        {   
            for (let p of process)  
            {
                const file = require(`C:/Users/R_a_g/OneDrive/Documents/code/js/discordjs/elitex-support/process/${p}`);
                
                if (interaction.customId == file.name)
                    await file.execute(client,interaction)
                
            }

        }
            
        try{ 
            
        let command = client.slash_commands.get(interaction.commandName);
        

        if(!command) return;

        await command.execute(client,interaction)
            
    }
        catch{
            return
        }
    }
}