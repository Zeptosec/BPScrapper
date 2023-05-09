import subscriberModel from "../models/subscriberModel.js";


var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

function checkEmail(email) {
    if (email.length > 254 || !emailRegex.test(email)) {
        return { success: false, msg: "Invalid email" };
    }
    // Further checking of some things regex can't handle
    let parts = email.split("@");
    if (parts[0].length > 64)
        return { success: false, msg: "Invalid email" };

    let domainParts = parts[1].split(".");
    if (domainParts.some(function (part) { return part.length > 63; }))
        return { success: false, msg: "Invalid email" };
    return { success: true };
}

export async function getSubscribers() {
    const subs = await subscriberModel.find({ receiving: true });
    const mails = subs.map(w => w.email);
    return mails;
}

export async function subscribe(email) {
    const rs = checkEmail(email);
    if (!rs.success)
        return rs;

    // check if already exists
    const sub = await subscriberModel.findOne({ email });
    // if nothing was found meaning new subscriber
    if (!sub) {
        await subscriberModel.create({ email, receiving: true });
    } else {
        // found one
        if (sub.receiving) {
            return { success: false, msg: "Email is already subscribed and receives updates" };
        } else {
            // found one but unsubscribed
            await subscriberModel.findOneAndUpdate({ email }, { receiving: true });
        }
    }
    return { success: true, msg: "Subscribed successfully!" };
}

export async function unsubscribe(email) {
    const rs = checkEmail(email);
    if (!rs.success)
        return rs;

    // check if already exists
    const sub = await subscriberModel.findOne({ email });

    if (!sub) {
        return { success: false, msg: "Email is not subscribed" }
    } else {
        if (!sub.receiving)
            return { success: false, msg: "Email is not subscribed" }
        else {
            await subscriberModel.findOneAndUpdate({ email }, { receiving: false });
        }
    }
    return { success: true, msg: "Unsubscribed!" };
}