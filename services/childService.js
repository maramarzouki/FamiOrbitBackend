const child = require('../models/childModel');

async function addChild(parentID, childUsername) {
    const alreadyExist = await child.findOne({ _id: parentID, childUsername: childUsername });
    if (alreadyExist) {
        throw new Error('This child name already used!');
    }
    const newChild = await child.create({ childUsername: childUsername, parentID: parentID });
    return newChild;
}

async function getAllChildren(parentID) {
    const children = await child.find({ parentID });
    return children;
}

async function getChildDetails(parentID, childUsername) {
    const child = await child.findOne({parentID: parentID, childUsername: childUsername});
    if(!child){
        return 'Child not found!';
    }
    return child;
}

async function addPhoneNumber(childID, phoneNumber) {
    console.log('phoneNumber variable:', phoneNumber);
    const alreadyExist = await child.findOne({ _id: childID, 'phoneNumbers.number': phoneNumber });
    if (alreadyExist) {
        throw new Error('Phone number already entered!');
    }

    const newPhoneNumber = { number: phoneNumber, verified: true, addedAt: new Date() }

    const res = await child.findByIdAndUpdate(
        childID,
        { $push: { phoneNumbers: newPhoneNumber } },
        { new: true, projection: { phoneNumbers: { $slice: -1 } } } // returns only the last element
    );

    if (!res) throw new Error('User not found');

    return res.phoneNumbers[0];
}

async function removePhoneNumber(childID, phoneNumber) {
    const exist = await user.findOne({ _id: childID, 'phoneNumbers.number': phoneNumber });
    if (!exist) {
        throw new Error('Phone number doesn\'t exist!');
    }

    const res = await user.findByIdAndUpdate(
        childID,
        { $pull: { phoneNumbers: { number: phoneNumber } } },
        { new: false }
    );
    if (!res) {
        throw new Error('User not found!');
    }
    return true;
}

module.exports = { addChild, getAllChildren, getChildDetails, addPhoneNumber, removePhoneNumber }