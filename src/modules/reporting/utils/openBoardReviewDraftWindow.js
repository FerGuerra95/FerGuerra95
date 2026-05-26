export const BOARD_REVIEW_DRAFT_POPUP_BLOCKED = 'BOARD_REVIEW_DRAFT_POPUP_BLOCKED';

export function openBoardReviewDraftWindow(html, options = {}) {
  const {
    autoPrint = false,
    windowRef = typeof window !== 'undefined' ? window : undefined
  } = options;

  if (!windowRef?.open) {
    return { ok: false, errorCode: BOARD_REVIEW_DRAFT_POPUP_BLOCKED };
  }

  const previewWindow = windowRef.open('', '_blank', 'width=1200,height=900');

  if (!previewWindow?.document) {
    return { ok: false, errorCode: BOARD_REVIEW_DRAFT_POPUP_BLOCKED };
  }

  try {
    previewWindow.opener = null;
  } catch {
    // Some browsers do not allow changing opener; the preview remains a local blank document.
  }

  previewWindow.document.open();
  previewWindow.document.write(String(html || ''));
  previewWindow.document.close();
  previewWindow.focus?.();

  if (autoPrint) {
    previewWindow.print?.();
  }

  return { ok: true };
}

export default openBoardReviewDraftWindow;
