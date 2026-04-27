export const saveFile = async (file) => ({
  type: 'file',
  name: file?.originalname || 'unknown'
});
