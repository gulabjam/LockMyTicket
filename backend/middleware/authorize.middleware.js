
export function authorizeRoles(allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied' });
        }
        next();
    };
};

export function authorizeOrganizer(req, res, next) {
    if (req.user.user_id != req.body.organizer_id) {
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
}