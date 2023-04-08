import tokenModel from './models/tokenModel.js';
import axios from 'axios';

export async function getToken() {
    let token = await tokenModel.findOne();
    // there should always be token present in a DB
    if (!token) {
        throw Error("Token not found in DB!")
        //token = await tokenModel.create({ jwt: "eYJdasfagasd", refreshToken: "dasfasfafasf" })
    }
    const diff = new Date().getTime() - new Date(token.updatedAt).getTime()
    // every 3 minutes refresh token just in case
    if (diff / 1000 > 180) {
        try {
            console.log("refreshing token")
            const rs = await axios.post(process.env.REFRESH_API, { refreshToken: token.refreshToken })
            token = await tokenModel.findOneAndUpdate({}, { jwt: rs.data.token, refreshToken: rs.data.refreshToken }, { new: true });
        } catch (err) {
            console.log(err);
            return null;
        }
    }
    return token.jwt;
}

export function validatePassPhrase(req, res, next) {
    const passPhrase = process.env.PASSPHRASE;
    const passQuery = req.query.pass;
    if (!passQuery)
        return res.status(401).setHeader("Failed", "missing param pass");
    if (passQuery !== passPhrase)
        return res.status(401).setHeader("Failed", "wrong pass").send();
    next();
}