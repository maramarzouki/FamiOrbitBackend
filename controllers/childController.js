const childService = require('../services/childService');

exports.addChild = async (req, res) => {
    try {
        const { childUsername, parentID } = req.body;
        const newChild = await childService.addChild(parentID, childUsername);
        res.status(201).json({ newChild });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const validationMsgs = Object.values(error.errors).map(err => err.message);
            return res.status(400).send({ error: validationMsgs.join(', ') });
        } else if (error.code === 11000) {
            return res.status(400).send({ error: 'This child name already used!' });
        }
        console.log(error.code);

        res.status(500).send({ error: error.message });
    }
}

exports.getAllChildren = async (req, res) => {
    try {
        const parentID = req.params.parentID;
        const childrenList = await childService.getAllChildren(parentID);
        console.log(childrenList);

        return res.status(200).json({ childrenList });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error.message });
    }
}

exports.getChildDetails = async (req, res) => {
    try {
        const { parentID, childUsername } = req.params;
        const fetchedChild = await childService.getChildDetails(parentID, childUsername);
        console.log(fetchedChild);
        return res.status(200).json({ fetchedChild });
    } catch (error) {
        console.log(error);
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
