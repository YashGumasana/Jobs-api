import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../errors/index.js";

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    console.log(authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {

        throw new UnauthenticatedError('Authentication invalid');
    }

    const token = authHeader.split(' ')[1];
    
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // const user = User.findById(payload.id).select('-password');
        // req.user = user;

        // override
        req.user = { userId: payload.userID, name: payload.name }
        // console.log(req.user);
        next();
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid');
    }
}
export default auth;