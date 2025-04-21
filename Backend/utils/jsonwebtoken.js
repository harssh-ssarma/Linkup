import jwt from 'jsonwebtoken';

const jwtToken = (userId, res) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in the environment variables.");
    }

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

    // Set the JWT as a cookie
    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: "strict",
        secure: true // Secure only in production
    });

    // Optionally return the token
};

export default jwtToken;
