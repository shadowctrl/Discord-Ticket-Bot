const { Schema, model} = require('mongoose');

const ticket = new Schema({
    tt_guild_id: Number,
    total_ticket_no:Number,
})

module.exports = model('Total-Ticket-No', ticket);