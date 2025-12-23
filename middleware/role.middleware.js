

module.exports = function requireRole(allowed = []) {
    return (req, res, next) => {
        if (!req.user) return res.send({
            status: false,
            statusCode: 401,
            message: "not authenticated"
        });
        if (!allowed.includes(req.user.role)) return res.send({
            status: false,
            statusCode: 403,
            message: "forbidden - insufficient role"
        });

        next();
    }
}