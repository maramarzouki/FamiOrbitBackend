const mongoose = require('mongoose')

var validate_username = (username) => {
    var re = /^[a-zA-Z0-9_]+$/;
    return re.test(username);
};

const validate_phone = (phone) => {
    const re = /^\+?[1-9]\d{1,14}$/;
    return re.test(phone);
};

const PhoneSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true,
        validate: [validate_phone, 'Invalid phone format (use E.164, e.g. +14155552671)'],
    },
    verified: { type: Boolean, default: false },
    addedAt: { type: Date, default: Date.now }
}, { _id: false });

const childSchema = mongoose.Schema ({
    childUsername:{
        type: String,
        required: true,
        unique: true,
        validate: [validate_username, 'Invalid username format!']
    },
    trustedContacts: {
        type: [PhoneSchema],
        default: []
    },
    safePlaces:[{
        type: String
    }],
    parentID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

const childModel = mongoose.model('children', childSchema);
module.exports = childModel;