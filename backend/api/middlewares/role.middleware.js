export const requireRole = (...roles) => (req, res, next) => {
  const currentRole = req.user?.role;
  if (!currentRole || !roles.includes(currentRole)) {
    return res.status(403).json({ ok: false, message: 'Forbidden' });
  }
  next();
};
