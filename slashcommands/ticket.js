const {MessageEmbed, Permissions, MessageActionRow, MessageButton} = require('discord.js');
const { SlashCommandBuilder} = require('@discordjs/builders');
require('dotenv').config();

module.exports={
    
    data: new SlashCommandBuilder()
        .setName("ticket")
        .setDescription("Sends Ticket Message to Channel")
        .addNumberOption(opt =>
                opt.setName("id")
                    .setDescription("Specify channel ID if required ")),
        

        async execute(client,interaction)
        {
            console.log("in sa");
            const id = interaction.options.getNumber('ticket');
            if (id){
                try{ var channel_id = interaction.guild.channels.cache.get(id); }
                
                catch{ interaction.reply(`Oops... I can't find <#${id}> in this server. ***Make sure the channel is visible for me...***` ); return; }
            }

            else {
                try{
                    var channel_id = interaction.guild.channels.cache.get(process.env.ticketchannel);
                }
                catch(err) { console.log(err); }
            }
            
        
        ///////////////////////////////////////////  Ticket-Message-Create  /////////////////////////////////////////

        const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('open-ticket')
					.setLabel('Open Ticket')
					.setStyle('PRIMARY'),
			);
        await interaction.reply({ content: 'Pong!', components: [row] });
                
        
        const collector = interaction.channel.createMesaageComponentCollector({
            filter, time: 60000
        });

        collector.on('collect', async i =>{
            if (i.customId === 'primary')
            { await i.update({ content: 'Button clicked'})}
        } );
		}

}
