const childService = require('../services/childService');

exports.addChild = async (req, res) => {
    try {
        const parentID = req.params.parentID;
        const { childName } = req.body;
        const newChild = childService.addChild(parentID, childName);
        res.status(201).send({ newChild });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const validationMsgs = Object.values(error.errors).map(err => err.message);
            return res.status(400).send({ error: validationMsgs.join(', ') });
        }
        res.status(500).send({ error: error.message });
    }
}

exports.addPhoneNumber = async (req, res) => {
    try {
        const pn = req.body.phoneNumber;
        console.log('phoneNumberrrrrrr:', pn);
        const childID = req.params.childID;
        const result = await childService.addPhoneNumber(childID, pn);
        return res.status(201).send(result);
    } catch (error) {
        res.status(500).send({ "ERROR adding phone number:": error.message });
    }
}

exports.removePhoneNumber = async (req, res) => {
    try {
        const phoneNumber = req.body.phoneNumber;
        const childID = req.params.childID;
        const r = await childService.removePhoneNumber(childID, phoneNumber);
        return res.status(200).send(r);
    } catch (error) {
        res.status(500).send({ "ERROR removing phone number:": error.message });
    }
}
