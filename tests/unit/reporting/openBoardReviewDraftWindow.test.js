import { describe, expect, it, vi } from 'vitest';

import {
  BOARD_REVIEW_DRAFT_POPUP_BLOCKED,
  openBoardReviewDraftWindow
} from '../../../src/modules/reporting/utils/openBoardReviewDraftWindow.js';

function createPreviewWindow() {
  return {
    document: {
      open: vi.fn(),
      write: vi.fn(),
      close: vi.fn()
    },
    focus: vi.fn(),
    print: vi.fn()
  };
}

describe('openBoardReviewDraftWindow', () => {
  it('opens a local window and writes HTML', () => {
    const previewWindow = createPreviewWindow();
    const windowRef = { open: vi.fn(() => previewWindow) };
    const result = openBoardReviewDraftWindow('<!doctype html><html><body>Board Review Draft</body></html>', { windowRef });

    expect(result).toEqual({ ok: true });
    expect(windowRef.open).toHaveBeenCalledWith('', '_blank', 'width=1200,height=900');
    expect(previewWindow.document.open).toHaveBeenCalledTimes(1);
    expect(previewWindow.document.write).toHaveBeenCalledWith(expect.stringContaining('Board Review Draft'));
    expect(previewWindow.document.close).toHaveBeenCalledTimes(1);
    expect(previewWindow.focus).toHaveBeenCalledTimes(1);
  });

  it('handles popup blocked state', () => {
    const windowRef = { open: vi.fn(() => null) };
    const result = openBoardReviewDraftWindow('<html></html>', { windowRef });

    expect(result).toEqual({ ok: false, errorCode: BOARD_REVIEW_DRAFT_POPUP_BLOCKED });
  });

  it('does not auto-print by default', () => {
    const previewWindow = createPreviewWindow();
    const windowRef = { open: vi.fn(() => previewWindow) };

    openBoardReviewDraftWindow('<html></html>', { windowRef });

    expect(previewWindow.print).not.toHaveBeenCalled();
  });

  it('prints only when explicitly requested', () => {
    const previewWindow = createPreviewWindow();
    const windowRef = { open: vi.fn(() => previewWindow) };

    openBoardReviewDraftWindow('<html></html>', { windowRef, autoPrint: true });

    expect(previewWindow.print).toHaveBeenCalledTimes(1);
  });

  it('does not call fetch or open an external URL', () => {
    const originalFetch = globalThis.fetch;
    const fetchSpy = vi.fn();
    globalThis.fetch = fetchSpy;
    const previewWindow = createPreviewWindow();
    const windowRef = { open: vi.fn(() => previewWindow) };

    openBoardReviewDraftWindow('<html></html>', { windowRef });

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(windowRef.open.mock.calls[0][0]).toBe('');
    if (originalFetch) {
      globalThis.fetch = originalFetch;
    } else {
      delete globalThis.fetch;
    }
  });
});
