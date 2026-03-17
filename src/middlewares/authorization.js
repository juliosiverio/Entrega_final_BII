const authorization = (roles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'No autenticado' });
    }

    const userRole = req.user.role;

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        status: 'error',
        message: `Acceso denegado. Se requiere rol: ${roles}`,
      });
    }

    next();
  };
};

module.exports = { authorization };

