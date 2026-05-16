/** Pixels from top of visible sidebar viewport where section titles should land. */
export const SIDEBAR_SECTION_TOP_GAP = 16;

export function scrollSidebarToWorkspace(workspaceKey) {
  const sidebar = document.querySelector('.sidebar.ceos-sidebar');

  if (!sidebar || !workspaceKey) return;

  if (workspaceKey === 'overview') {
    sidebar.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const section = sidebar.querySelector(
    `.ceos-nav-section[data-workspace-key="${workspaceKey}"]`
  );
  const targetTitle = section?.querySelector('.ceos-nav-section-title');

  if (!targetTitle) return;

  const sidebarRect = sidebar.getBoundingClientRect();
  const titleRect = targetTitle.getBoundingClientRect();
  const titleTop =
    titleRect.top - sidebarRect.top + sidebar.scrollTop - SIDEBAR_SECTION_TOP_GAP;
  const maxScroll = Math.max(sidebar.scrollHeight - sidebar.clientHeight, 0);

  sidebar.scrollTo({
    top: Math.min(Math.max(titleTop, 0), maxScroll),
    behavior: 'smooth'
  });
}
