require('dotenv');

const { MessageEmbed} = require('discord.js');
const db = require('C:/Users/R_a_g/OneDrive/Documents/code/js/discordjs/elitex-support/mongodb/schema');

module.exports={

    name: "delete-ticket",

    async execute(client,interaction)
    {   
      

        if(interaction.customId == "delete-ticket")
        { 
            var ticket_channel_logs=await client.channels.cache.get(process.env.closed_ticket_logs);
            var channel = await client.channels.cache.get(interaction.channelId);
            const data = await db.findOne({ ticket_channel_id: interaction.channelId});
            
            const closed = new MessageEmbed()
                        .setTitle(`Ticket Log`)
                        .setDescription("log")
                        .setColor("AQUA")
                    
                        .addFields(
                            { name : "Ticket-No", value: `${data.user_ticket_no}`,inline:true},
                            { name: "User Id", value: `${data.user_id}`,inline:true},
                            { name: "Ticket Channel", value: `${data.ticket_channel_id}`,inline:true},
                            { name: "Ticket Status", value:`${data.ticket_status}`,inline:true },
                            )
                        
                        .setTimestamp();

            await interaction.channel.bulkDelete(1)
            setTimeout(async () => {
                await ticket_channel_logs.send({embeds:[closed]});
                await channel.delete();
                await db.deleteOne(data);
            },3000);

            }
    },
}