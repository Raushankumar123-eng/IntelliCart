const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: true,       // 🔐 Required for HTTPS (Render)
        sameSite: "none",   // 🔥 Required for cross-site cookies
    };

    res.status(statusCode)
        .cookie("token", token, options)
        .json({
            success: true,
            user,
            token,
        });
};

module.exports = sendToken;
