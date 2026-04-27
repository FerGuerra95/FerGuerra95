export const translationClient = {
  async translate(text, target = 'es') {
    return { text, target, translatedText: text };
  }
};
