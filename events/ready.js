require('dotenv');

const { REST } = require('@discordjs/rest');

const { Routes } = require('discord-api-types/v9');

const slash_commands_arr = require('../index');

module.exports={
    name: "ready",

    async execute(client){
        
        
        console.log("Ready to rock and roll")


    }   
}