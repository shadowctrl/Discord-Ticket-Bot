require('dotenv');

const { MessageEmbed} = require('discord.js');
const db = require('C:/Users/R_a_g/OneDrive/Documents/code/js/discordjs/elitex-support/mongodb/schema');
const hastebin = require('hastebin');

module.exports={

    name: "delete-ticket",

    async execute(client,interaction)
    {   
      

        if(interaction.customId == "delete-ticket")
        { 
          
            var ticket_channel_logs=await client.channels.cache.get(process.env.closed_ticket_logs);
            var channel = await client.channels.cache.get(interaction.channelId);
            await channel.messages.fetch().then(async(messages) => 
            {
                
                let a = messages.filter(m => m.author.bot !== true).map(m =>
                    `${new Date(m.createdTimestamp).toLocaleString('fr-FR')} - ${m.author.username}#${m.author.discriminator}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`
                )
                .reverse().join('\n');
                
                if (a.length < 1) a = "Nothing";

                hastebin.createPaste(a, {                
                        contentType: 'text/plain',
                        server: 'https://hastebin.com'
                    })                    
                    .then(async function(url) {
                        const data = await db.findOne({ ticket_channel_id: interaction.channelId});
                        data.ticket_status="Deleted"
                        await data.save();
                        const closed = new MessageEmbed()
                                    .setTitle(`Ticket Log`)
                                    .setDescription("log")
                                    .setColor("AQUA")
                                
                                    .addFields(
                                        { name : "Ticket-No", value: `${data.user_ticket_no}`,inline:true},
                                        { name: "User Id", value: `${data.user_id}`,inline:true},
                                        { name: "Ticket Channel", value: `${data.ticket_channel_id}`,inline:true},
                                        { name: "Ticket Status", value:`${data.ticket_status}`,inline:true },
                                        { name: "Chat Log", value:`${url}`}
                                        )
                                    
                                    .setTimestamp();

                        await interaction.channel.bulkDelete(1)
                        await channel.send({content:`Hold on deleting ticket. You can check logs at <#${process.env.closed_ticket_logs}>`,embeds:[closed]},)
                        setTimeout(async () => {
                            await ticket_channel_logs.send({embeds:[closed]});
                            await channel.delete();
                            await db.deleteOne(data);
                        },3000);
                    
                    });
            });
      
        }
    }
}