const child = require('../models/childModel');
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

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

async function getChildDetails(childID) {
    console.log(childID);
    const fetchedChild = await child.findOne({ _id: childID });
    if (!fetchedChild) {
        return 'Child not found!';
    }
    return fetchedChild;
}

async function addPhoneNumber(childID, phoneNumber) {
    console.log('phoneNumber variable:', phoneNumber);
    const alreadyExist = await child.findOne({ _id: childID, 'trustedContacts.number': phoneNumber });
    if (alreadyExist) {
        throw new Error('Phone number already entered!');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // const newPhoneNumber = { number: phoneNumber, verified: true, addedAt: new Date() }
    const newPhoneNumber = {
        number: phoneNumber,
        verified: false,
        addedAt: new Date(),
        otp: otp, // In production, hash this (e.g., with bcrypt)
        otpExpiry: otpExpiry
    };

    const res = await child.findByIdAndUpdate(
        childID,
        { $push: { trustedContacts: newPhoneNumber } },
        { new: true, projection: { trustedContacts: { $slice: -1 } } } // returns only the last element
    );

    if (!res) throw new Error('User not found');

    await client.messages.create({
        body: `Your verification code is ${otp}. Expires in 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
    });

    return { message: 'OTP sent for verification', phone: res.trustedContacts[0] };
}

async function verifyPhoneNumber(childID, phoneNumber, otp) {
    const child = await childModel.findOne({ _id: childID, 'trustedContacts.number': phoneNumber });
    if (!child) throw new Error('Child or phone not found');

    const phoneEntry = child.trustedContacts.find(p => p.number === phoneNumber);
    if (!phoneEntry || phoneEntry.otp !== otp || phoneEntry.otpExpiry < new Date()) {
        throw new Error('Invalid or expired OTP');
    }

    // mark as verified and clear OTP
    phoneEntry.verified = true;
    phoneEntry.otp = undefined;
    phoneEntry.otpExpiry = undefined;
    await child.save();

    return { message: 'Phone verified successfully' };
}

async function removePhoneNumber(childID, phoneNumber) {
    const exist = await child.findOne({ _id: childID, 'trustedContacts.number': phoneNumber });
    if (!exist) {
        throw new Error('Phone number doesn\'t exist!');
    }

    const res = await child.findByIdAndUpdate(
        childID,
        { $pull: { trustedContacts: { number: phoneNumber } } },
        { new: false }
    );
    if (!res) {
        throw new Error('User not found!');
    }
    return true;
}

async function deleteChild(childID) {
    const fetchedChild = await child.findOne({ _id: childID });
    if (!fetchedChild) {
        throw new Error('Child not found!');
    }

    const res = await fetchedChild.delete();
    return res;
}

module.exports = { addChild, getAllChildren, getChildDetails, addPhoneNumber, verifyPhoneNumber, removePhoneNumber, deleteChild }