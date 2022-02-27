require('dotenv');

const { Permissions,MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const db = require('C:/Users/R_a_g/OneDrive/Documents/code/js/discordjs/elitex-support/mongodb/schema');

module.exports={
    name: "close-ticket",

    async run(client,interaction)
    {
        
            {
                const data = await db.findOne({ ticket_channel_id: interaction.channelId});
                    
                const verify_embed = new MessageEmbed()
                    .setColor("YELLOW")
                    .setTitle(`Ticket Details`)
                    .setDescription("Ticket Supporters... Delete ticket after verifying...")
                    .addFields(
                        {name: "Ticket No", value:`${data.user_ticket_no}`,inline:true},
                        {name: "Ticket Status", value:`${data.ticket_status}`, inline:true},
                        {name: "Closed By", value: `${interaction.member}`, inline:true},
                    )
                    .setFooter({text:'EliteX Support', iconURL:process.env.eliteximage})
                    .setTimestamp();

                const verify_row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId("delete-ticket")
                            .setLabel(`Delete Ticket - #${data.user_ticket_no}`)
                            .setEmoji('🗑️')
                            .setStyle("DANGER"),
                    );
                        
                await interaction.editReply({embeds:[verify_embed], components:[verify_row]});
                    
            }
        
    },

    async execute(client,interaction)
    {   
        var channel = await client.channels.cache.get(interaction.channelId);
        
        const data = await db.findOne({ ticket_channel_id: interaction.channelId});
        if(data)
        {   
            const confirm_embed = new MessageEmbed()
                .setColor('RED')
                .setTitle(`confirm closure. Ticket-#${data.user_ticket_no}`)
                .setTimestamp()
                .setFooter({ text: "EliteX Support", iconURL:`${process.env.eliteximage}`})

            const confirm_row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('confirm-close')
                        .setLabel(`I hereby confirm closure of my ticket - #${data.user_ticket_no}`)
                        .setStyle("DANGER"),

                    new MessageButton()
                        .setCustomId('cancel-close')
                        .setLabel('Cancel closure')
                        .setStyle('SECONDARY'),
                );
            
                const row = new MessageActionRow()
                                    .addComponents(
                                        new MessageButton()
                                            .setCustomId('close-ticket')
                                            .setLabel('Close ticket')
                                            .setEmoji('899745362137477181')
                                            .setStyle('DANGER')
                                            .setDisabled(true),
                                    )
            var dis_msg;
            await client.channels.cache.get(interaction.channelId).messages.fetch(data.close_ticket_id).then(async msg => {
                dis_msg=await msg.edit({components:[row]});
            })    
            await interaction.reply({embeds:[confirm_embed], components:[confirm_row]});

            const collector = await interaction.channel.createMessageComponentCollector({
                componentType:'BUTTON',
                time: 30000
            });

            collector.on('collect', async (i) =>
            {
                if (i.customId == "confirm-close")
                {   
                    data.ticket_status="Closed";
                    await data.save();
            
                    const close_embed=new MessageEmbed()
                        .setColor("DARK_RED")
                        .setTitle(`Ticket Details`)
                        .addFields(
                            {name: "Ticket No", value:`${data.user_ticket_no}`,inline:true},
                            {name: "Ticket Status", value:`${data.ticket_status}`, inline:true},
                            {name: "Closed By", value: `${i.member}`, inline:true},
                        )
                        .setFooter({text:'EliteX Support', iconURL:process.env.eliteximage})
                        .setTimestamp();
                    
                        await interaction.editReply({ embeds: [close_embed], components:[] });

                        overwrites = [{
                            id: data.user_id,
                            deny: [Permissions.FLAGS.VIEW_CHANNEL,
                                    Permissions.FLAGS.SEND_MESSAGES]
                        },
                        {
                            id: process.env.ticket_support_role_id,
                            allow: [Permissions.FLAGS.VIEW_CHANNEL,
                                    Permissions.FLAGS.SEND_MESSAGES]
                        },
                        {
                            id: interaction.guild.roles.everyone,
                            deny: [Permissions.FLAGS.VIEW_CHANNEL]
                        },]
                        
                        
                    setTimeout(async () => {await channel.edit({
                        name: `closed-${channel.name}`,
                        parent: process.env.parentclosed,
                        permissionOverwrites:overwrites,

                    }).then(await this.run(client,interaction));},3000);
                                       
                    await collector.stop();

                    
                }

                if (i.customId == "cancel-close")
                {   
                    let a= await interaction.editReply({ content: "Ticket Closure Cancelled.", embeds: [], components: [],ephemeral:true});
                    setTimeout(async () => await a.delete(), 3000);
                    row.components[0].setDisabled(false)
                    await dis_msg.edit({components:[row]})
                    await collector.stop();
                }
            });
            
          

            collector.on('end', async (i) => {
                if (i.size < 1) {
                a=await interaction.editReply({content: "Ticket Closure Cancelled",components:[],embeds:[], ephemeral:true});
                row.components[0].setDisabled(false)
                await dis_msg.edit({components:[row]})
                setTimeout(async () => await a.delete(),3000);    
            }
            })

            
            
        }
    
    },
    
    
}