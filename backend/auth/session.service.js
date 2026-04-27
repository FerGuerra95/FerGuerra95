export const createSession = async (userId) => ({
  id: `session_${Date.now()}`,
  userId,
  createdAt: new Date().toISOString()
});
