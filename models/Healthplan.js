const mongoose = require('mongoose');

const Healthplan = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    doctorFollowup: {
        type: String,
        required: true
    },
    seniorDietecianFollowup: {
        type: String,
        required: true
    },
    dietecianFollowup: {
        type: String,
        required: true
    },
    file: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('healthplan', Healthplan);