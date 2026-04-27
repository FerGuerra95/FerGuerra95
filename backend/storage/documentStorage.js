export const saveDocument = async (document) => ({
  type: 'document',
  id: document?.id || null
});
