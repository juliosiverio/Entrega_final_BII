const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
    default: () => Math.random().toString(36).substring(2, 10).toUpperCase(),
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;

