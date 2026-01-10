//Utility     → creates token from user data

import jwt from 'jsonwebtoken';
export function signAccessToken(user) {
    return jwt.sign(
        {userId:user._id},
        process.env.JWT_SECRET,
        {expiresIn:"45min"}
    );
}