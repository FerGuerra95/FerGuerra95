export const hasPermission = (role, permission) => {
  const matrix = {
    admin: ['*'],
    analyst: ['ma:read', 'ma:write', 'compliance:read'],
    reviewer: ['compliance:read', 'compliance:review']
  };

  return matrix[role]?.includes('*') || matrix[role]?.includes(permission) || false;
};
