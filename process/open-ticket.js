const { MessageEmbed,Permissions, MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");

const db = require('C:/Users/R_a_g/OneDrive/Documents/code/js/discordjs/elitex-support/mongodb/schema');
const ticket_no=require('C:/Users/R_a_g/OneDrive/Documents/code/js/discordjs/elitex-support/mongodb/ticket_no');
require('dotenv');


module.exports={
    name: "open-ticket",

    async execute(client,interaction)
    {   
        var user_name = interaction.user.username;
        var guild_id = interaction.guildId;
        var user_id = interaction.user.id;

        var data = await db.findOne({user_id: user_id});
        if (data)
        {
            const exist = new MessageEmbed()
                .setColor("RED")
                .setTitle("Resource Control")
                .addField("Reason","You already have a open ticket.",true)
                .addField("Ticket_No",`${data.user_ticket_no}`,true)
                .setFooter({text: "EliteX Support", iconURL: `${process.env.eliteximage}`})
                .setTimestamp()
                .setThumbnail(`${process.env.eliteximage}`);

            await interaction.reply({ embeds: [exist], ephemeral: true  });

        }

        if (!data)
        {   
            await db.deleteOne(data);
           
            var ticket = await ticket_no.findOne({tt_guild_id: guild_id});
        
            if (!ticket) {
              
                const new_t_no = new ticket_no({
                    tt_guild_id:guild_id,
                    total_ticket_no:0,
                });
                await new_t_no.save();
                
            }
            
            overwrites = [{
                id: user_id,
                allow: [Permissions.FLAGS.VIEW_CHANNEL,
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

 ////////////////////////////////////////////// Open Ticket //////////////////////////////////////////////////

            var ticket_channel=await interaction.guild.channels.create(`ticket-${user_name}`,{
                type:"text",
                permissionOverwrites:overwrites,
                });
            await ticket_channel.edit({
                    parent: process.env.ticket
                });
           
            var user_ticket_no=ticket.total_ticket_no+1;
            ticket.total_ticket_no=user_ticket_no;
            
            ticket_channel_id=ticket_channel.id;         
            var ticket_status="Dispatched";

            const ticket_create=new MessageEmbed()
                .setDescription("Your ticket has been created")
                .setColor("RANDOM")
                .addField("Ticket Channel",`<#${ticket_channel_id}>`,true)
                .addField("Ticket No",`${user_ticket_no}`)
                .addField("By",`<@${user_id}>`,true)
                .addField("status",`${ticket_status}`,true)
                .setFooter({text: "EliteX Support", iconURL: `${process.env.eliteximage}`})
                .setTimestamp()
                .setThumbnail(`${process.env.eliteximage}`);
                
                const newdata = new db({
                    guild: guild_id,
                    user_id:user_id,
                    ticket_channel_id: ticket_channel_id ,
                    user_ticket_no: user_ticket_no,
                    ticket_status:`${ticket_status}`
                },);
                await newdata.save();
                
                await ticket.save(); //Commit Changes To Ticket-Details-Database
                await interaction.reply({embeds: [ticket_create],ephemeral:true});


//////////////////////////////////////////////////////      Category Embed      ////////////////////////////////////////////////////////
            
            newdata.ticket_status="processing";
            await newdata.save();

            const category = new MessageEmbed()
                .setColor("RANDOM")
                .setDescription("Kindly Select Your Ticket Category")
                .setFooter({text: "EliteX Support", iconURL: `${process.env.eliteximage}`})
                .setTimestamp()
                .setThumbnail(`${process.env.eliteximage}`);
                
            const row_category = new MessageActionRow()
                .addComponents(
                        new MessageSelectMenu()
                            .setCustomId('category')
                            .setPlaceholder("Select Ticket Category")
                            .addOptions([{
                                label: 'OOC',
                                value: "ooc",
                                emoji: "📝"
                            },
                                
                            {
                                label: 'BUGS',
                                value: 'bugs',
                                emoji: '🐛',
                            },
                            {
                                label: 'SUPPORTERS PACK',
                                value: 'supporters',
                                emoji: '💎',
                            },
                            {
                                label: 'PLANNED RP',
                                value: 'planned',
                                emoji: '📓',
                            },
                            {
                                label: 'CHARACTER ISSUE',
                                value: 'character',
                                emoji: '🪲',
                            },
                            {
                                label: 'OTHERS',
                                value: 'others',
                                emoji: '📙',
                            }])
                            );
                        
            category_message=await ticket_channel.send({
                content: `<@${user_id}>`,
                embeds:[category],
                components: [row_category],
            });
            
            
//////////////////////////////////////////////////////////  Ticket Category Response  ////////////////////////////////////////////////////

            const collector = ticket_channel.createMessageComponentCollector({
                componentType: 'SELECT_MENU',
                time: 60000
            });
           
            collector.on('collect', i => 
            {   
                
                if (i.user.id == user_id)
                {
                    if (category_message.deletable)
                    {   
                        
                        category_message.delete();
                        newdata.ticket_status="Reviewing";
                        const embed = new MessageEmbed()
                                    .setColor('RANDOM')
                                    .setDescription(`<@${user_id}> Created a ticket ${i.values[0]}`)
                                    .setFooter({text:'EliteX Support', iconURL:'https://cdn.discordapp.com/attachments/782584284321939468/784745798789234698/2-Transparent.png'})
                                    .setTimestamp();

                                const row = new MessageActionRow()
                                    .addComponents(
                                        new MessageButton()
                                            .setCustomId('close-ticket')
                                            .setLabel('Close ticket')
                                            .setEmoji('899745362137477181')
                                            .setStyle('DANGER'),
                                    );

                                    const opened = ticket_channel.send({
                                        content: `Your Ticket Has Been Created!`,
                                        embeds: [embed],
                                        components: [row]
                                    });

                                    if (i.values[0] == 'ooc') 
                                    {
                                        ticket_channel.edit({
                                            parent: process.env.parentooc
                                        });
                                    }
                                    
                                    if (i.values[0] == 'bugs') 
                                    {
                                        ticket_channel.edit({
                                            parent: process.env.parentbugs
                                        });
                                    }
                    
                                    if (i.values[0] == 'supporters') 
                                    {
                                        ticket_channel.edit({
                                            parent: process.env.parentsupporters
                                        });
                                    }
                    
                                    if (i.values[0] == 'planned') 
                                    {
                                        ticket_channel.edit({
                                            parent: process.env.parentplanned
                                        });
                                    }
                    
                                    if (i.values[0] == 'character') 
                                    {
                                        ticket_channel.edit({
                                            parent: process.env.parentcharacter
                                        })
                                    }
                    
                                    if (i.values[0] == 'others') 
                                    {
                                        ticket_channel.edit({
                                            parent: process.env.parentothers
                                        });
                                    }
                                    
                                    newdata.save();
                     
                    }
                }
                else 
                {
                    const embed = new MessageEmbed()
                        .setTitle("Identity Verifier")
                        .setDescription("I have been noticed that you are not allowed to select options. Only ticket owners can...")
                        .setTimestamp()
                        .setFooter({text:'EliteX Support', iconURL:'https://cdn.discordapp.com/attachments/782584284321939468/784745798789234698/2-Transparent.png'})
                    
                    interaction.reply({embeds : [embed]});
                }

            });     // Collector Close   

            collector.on('end', collected => {
                if (collected.size < 1) 
                {   
                    newdata.ticket_status="Closed";
                    newdata.save();
                    const timeout = new MessageEmbed()
                    .setColor("RED")
                    .setTitle("Resource Control")
                    .addField("Reason","No Category Selected... Timedout.",true)
                    .addField("Ticket_No",`${newdata.user_ticket_no}`,true)
                    .addField("Ticket status",`${newdata.ticket_status}`,true)
                    .setFooter({text: "EliteX Support", iconURL: `${process.env.eliteximage}`})
                    .setTimestamp()
                    .setThumbnail(`${process.env.eliteximage}`);
                   
                    ticket_channel.send({embeds: [timeout]}).then(() => 
                    {
                        setTimeout(async() => {
                            if (ticket_channel.deletable) {
                                ticket_channel.delete();
                                await  db.deleteOne(newdata);                                
                            };
                        }, 5000);
                        
                    })
                   
                }
            });  

        }
    }
}
