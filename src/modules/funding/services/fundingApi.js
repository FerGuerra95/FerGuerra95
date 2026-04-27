import { DEFAULT_FUNDING_INPUTS, DEFAULT_FUNDING_SETTINGS, FUNDING_STORAGE_KEYS } from '../engine/fundingFormulas.js';

export const fundingApi = {
  loadDraft() {
    try {
      const rawInputs = localStorage.getItem(FUNDING_STORAGE_KEYS.DRAFT);
      const rawSettings = localStorage.getItem(FUNDING_STORAGE_KEYS.SETTINGS);
      return {
        fundingInputs: rawInputs ? { ...DEFAULT_FUNDING_INPUTS, ...JSON.parse(rawInputs) } : DEFAULT_FUNDING_INPUTS,
        fundingSettings: rawSettings ? { ...DEFAULT_FUNDING_SETTINGS, ...JSON.parse(rawSettings) } : DEFAULT_FUNDING_SETTINGS
      };
    } catch {
      return {
        fundingInputs: DEFAULT_FUNDING_INPUTS,
        fundingSettings: DEFAULT_FUNDING_SETTINGS
      };
    }
  },
  saveDraft(fundingInputs, fundingSettings) {
    localStorage.setItem(FUNDING_STORAGE_KEYS.DRAFT, JSON.stringify(fundingInputs));
    localStorage.setItem(FUNDING_STORAGE_KEYS.SETTINGS, JSON.stringify(fundingSettings));
  }
};
