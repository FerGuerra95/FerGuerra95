export const saveEvidenceBlob = async (evidence) => ({
  type: 'evidence',
  id: evidence?.id || null
});
