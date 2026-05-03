import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const workspaceSwitcherCss = `
  .ceos-workspace-switcher {
    --visual-index: 0;
    position: relative;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: center;
    min-width: 368px;
    padding: 6px;
    border-radius: 999px;
    overflow: hidden;
    background:
      radial-gradient(circle at 0% 0%, rgba(255,255,255,0.050), transparent 34%),
      linear-gradient(135deg, rgba(255,255,255,0.044), rgba(255,255,255,0.012)),
      rgba(0,0,0,0.82);
    border: 1px solid rgba(255,255,255,0.075);
    box-shadow:
      0 18px 42px rgba(0,0,0,0.48),
      inset 0 1px 0 rgba(255,255,255,0.055),
      inset 0 -1px 0 rgba(255,255,255,0.014);
    backdrop-filter: blur(18px) saturate(140%);
    -webkit-backdrop-filter: blur(18px) saturate(140%);
    user-select: none;
    touch-action: none;
    cursor: grab;
  }

  .ceos-workspace-switcher.is-dragging {
    cursor: grabbing;
  }

  .ceos-workspace-switcher::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background:
      linear-gradient(
        115deg,
        rgba(255,255,255,0.050) 0%,
        rgba(255,255,255,0.014) 22%,
        transparent 48%,
        transparent 100%
      );
    opacity: 0.58;
    pointer-events: none;
  }

  .ceos-workspace-thumb {
    position: absolute;
    left: 6px;
    top: 6px;
    width: calc((100% - 12px) / 3);
    height: calc(100% - 12px);
    border-radius: 999px;
    transform: translateX(calc(var(--visual-index) * 100%));
    background:
      radial-gradient(circle at 18% 50%, rgba(16,185,129,0.24), transparent 42%),
      radial-gradient(circle at 88% 50%, rgba(96,165,250,0.16), transparent 48%),
      linear-gradient(135deg, rgba(16,185,129,0.22), rgba(8,14,22,0.97) 70%);
    border: 1px solid rgba(255,255,255,0.090);
    box-shadow:
      0 14px 30px rgba(0,0,0,0.42),
      0 0 28px rgba(16,185,129,0.13),
      inset 0 1px 0 rgba(255,255,255,0.100),
      inset 0 -1px 0 rgba(255,255,255,0.018);
    transition:
      transform .42s cubic-bezier(.22,.61,.36,1),
      box-shadow .24s ease,
      background .24s ease;
    pointer-events: none;
    z-index: 1;
  }

  .ceos-workspace-switcher.is-dragging .ceos-workspace-thumb {
    transition: transform .025s linear;
    box-shadow:
      0 16px 34px rgba(0,0,0,0.52),
      0 0 36px rgba(16,185,129,0.18),
      0 0 24px rgba(212,175,55,0.10),
      inset 0 1px 0 rgba(255,255,255,0.120),
      inset 0 -1px 0 rgba(255,255,255,0.020);
  }

  .ceos-workspace-thumb::before {
    content: "";
    position: absolute;
    inset: 1px;
    border-radius: inherit;
    background:
      linear-gradient(
        180deg,
        rgba(255,255,255,0.090),
        rgba(255,255,255,0.018) 36%,
        transparent 74%,
        rgba(255,255,255,0.020)
      );
    pointer-events: none;
  }

  .ceos-workspace-option {
    position: relative;
    z-index: 2;
    min-height: 42px;
    padding: 0 18px;
    border-radius: 999px;
    background: transparent;
    color: rgba(226,232,240,0.64);
    cursor: inherit;
    font-size: 14px;
    font-weight: 850;
    letter-spacing: -0.012em;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      color .22s ease,
      text-shadow .22s ease,
      transform .18s ease,
      filter .18s ease;
  }

  .ceos-workspace-option:hover {
    color: rgba(255,255,255,0.96);
    transform: translateY(-1px);
    text-shadow:
      0 0 14px rgba(255,255,255,0.10),
      0 0 12px rgba(212,175,55,0.08);
  }

  .ceos-workspace-option.is-active {
    color: #ffffff;
    text-shadow:
      0 0 16px rgba(255,255,255,0.12),
      0 0 18px rgba(16,185,129,0.12);
  }

  .ceos-workspace-option span {
    position: relative;
    z-index: 2;
    pointer-events: none;
  }

  body.ceos-workspace-dragging,
  body.ceos-workspace-dragging * {
    cursor: grabbing !important;
    user-select: none !important;
  }

  @media (max-width: 860px) {
    .ceos-workspace-switcher {
      width: 100%;
      min-width: 0;
    }

    .ceos-workspace-option {
      min-height: 40px;
      padding: 0 12px;
      font-size: 13px;
    }
  }
`;

const WORKSPACES = [
  {
    key: 'ma',
    label: 'M&A',
    path: '/ma/dashboard',
    sidebarLabel: 'M&A'
  },
  {
    key: 'compliance',
    label: 'Compliance',
    path: '/compliance/dashboard',
    sidebarLabel: 'COMPLIANCE'
  },
  {
    key: 'funding',
    label: 'Funding',
    path: '/funding/dashboard',
    sidebarLabel: 'FUNDING'
  }
];

let sidebarAnimationFrame = null;
let sidebarTargetScroll = 0;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getWorkspace(pathname) {
  if (pathname.startsWith('/compliance')) return 'compliance';
  if (pathname.startsWith('/funding')) return 'funding';
  return 'ma';
}

function getWorkspaceIndex(workspace) {
  const index = WORKSPACES.findIndex((item) => item.key === workspace);
  return index >= 0 ? index : 0;
}

function getWorkspaceByIndex(index) {
  return WORKSPACES[clamp(index, 0, WORKSPACES.length - 1)] || WORKSPACES[0];
}

function getVisualIndexFromClientX(clientX, element) {
  const rect = element.getBoundingClientRect();
  const usableWidth = Math.max(rect.width - 12, 1);
  const localX = clamp(clientX - rect.left - 6, 0, usableWidth);
  const segmentWidth = usableWidth / WORKSPACES.length;

  return clamp(localX / segmentWidth - 0.5, 0, WORKSPACES.length - 1);
}

function getSidebarTargetTop(workspaceKey) {
  const sidebar = document.querySelector('.ceos-sidebar');

  if (!sidebar) return 0;

  const workspace = WORKSPACES.find((item) => item.key === workspaceKey);

  if (!workspace) return 0;

  const sectionTitles = Array.from(
    sidebar.querySelectorAll('.ceos-nav-section-title')
  );

  const targetTitle = sectionTitles.find((title) => {
    return title.textContent?.trim().toUpperCase() === workspace.sidebarLabel;
  });

  if (!targetTitle) {
    return workspaceKey === 'ma' ? 0 : sidebar.scrollTop;
  }

  const maxScroll = Math.max(sidebar.scrollHeight - sidebar.clientHeight, 0);

  return clamp(Math.max(targetTitle.offsetTop - 18, 0), 0, maxScroll);
}

function getInterpolatedSidebarTop(visualIndex) {
  const safeIndex = clamp(visualIndex, 0, WORKSPACES.length - 1);
  const lowerIndex = Math.floor(safeIndex);
  const upperIndex = Math.ceil(safeIndex);
  const progress = safeIndex - lowerIndex;

  const lowerTop = getSidebarTargetTop(WORKSPACES[lowerIndex].key);
  const upperTop = getSidebarTargetTop(WORKSPACES[upperIndex].key);

  return lowerTop + (upperTop - lowerTop) * progress;
}

function animateSidebarTo(targetTop, intensity = 0.105) {
  const sidebar = document.querySelector('.ceos-sidebar');

  if (!sidebar) return;

  sidebarTargetScroll = targetTop;

  if (sidebarAnimationFrame) return;

  function step() {
    const currentSidebar = document.querySelector('.ceos-sidebar');

    if (!currentSidebar) {
      sidebarAnimationFrame = null;
      return;
    }

    const currentTop = currentSidebar.scrollTop;
    const distance = sidebarTargetScroll - currentTop;

    if (Math.abs(distance) < 0.35) {
      currentSidebar.scrollTop = sidebarTargetScroll;
      sidebarAnimationFrame = null;
      return;
    }

    currentSidebar.scrollTop = currentTop + distance * intensity;
    sidebarAnimationFrame = window.requestAnimationFrame(step);
  }

  sidebarAnimationFrame = window.requestAnimationFrame(step);
}

function scrollSidebarToVisualIndex(visualIndex) {
  animateSidebarTo(getInterpolatedSidebarTop(visualIndex), 0.115);
}

function scrollSidebarToWorkspace(workspaceKey) {
  animateSidebarTo(getSidebarTargetTop(workspaceKey), 0.105);
}

export function WorkspaceSwitcher() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const switcherRef = useRef(null);
  const latestIndexRef = useRef(0);

  const workspace = getWorkspace(pathname);
  const activeIndex = getWorkspaceIndex(workspace);

  const [isDragging, setIsDragging] = useState(false);
  const [visualIndex, setVisualIndex] = useState(activeIndex);

  const roundedVisualIndex = clamp(Math.round(visualIndex), 0, WORKSPACES.length - 1);
  const highlightedIndex = isDragging ? roundedVisualIndex : activeIndex;

  useEffect(() => {
    if (!isDragging) {
      setVisualIndex(activeIndex);
      latestIndexRef.current = activeIndex;
    }
  }, [activeIndex, isDragging]);

  useEffect(() => {
    if (!isDragging) return undefined;

    function move(clientX) {
      const element = switcherRef.current;

      if (!element) return;

      const nextIndex = getVisualIndexFromClientX(clientX, element);

      latestIndexRef.current = nextIndex;
      setVisualIndex(nextIndex);
      scrollSidebarToVisualIndex(nextIndex);
    }

    function handleMouseMove(event) {
      event.preventDefault();
      move(event.clientX);
    }

    function handleTouchMove(event) {
      const touch = event.touches?.[0];

      if (!touch) return;

      event.preventDefault();
      move(touch.clientX);
    }

    function finishDrag() {
      const nearestIndex = clamp(
        Math.round(latestIndexRef.current),
        0,
        WORKSPACES.length - 1
      );

      const nextWorkspace = getWorkspaceByIndex(nearestIndex);

      document.body.classList.remove('ceos-workspace-dragging');

      setIsDragging(false);
      setVisualIndex(nearestIndex);

      scrollSidebarToWorkspace(nextWorkspace.key);
      navigate(nextWorkspace.path);
    }

    function cancelDrag() {
      document.body.classList.remove('ceos-workspace-dragging');

      setIsDragging(false);
      setVisualIndex(activeIndex);
      latestIndexRef.current = activeIndex;
      scrollSidebarToWorkspace(workspace);
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: false });
    window.addEventListener('mouseup', finishDrag);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', finishDrag);
    window.addEventListener('touchcancel', cancelDrag);
    window.addEventListener('blur', cancelDrag);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', finishDrag);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', finishDrag);
      window.removeEventListener('touchcancel', cancelDrag);
      window.removeEventListener('blur', cancelDrag);
      document.body.classList.remove('ceos-workspace-dragging');
    };
  }, [activeIndex, isDragging, navigate, workspace]);

  function startDragFromClientX(clientX) {
    const element = switcherRef.current;

    if (!element) return;

    const nextIndex = getVisualIndexFromClientX(clientX, element);

    latestIndexRef.current = nextIndex;

    document.body.classList.add('ceos-workspace-dragging');

    setIsDragging(true);
    setVisualIndex(nextIndex);
    scrollSidebarToVisualIndex(nextIndex);
  }

  function handleMouseDown(event) {
    if (event.button !== 0) return;

    event.preventDefault();
    startDragFromClientX(event.clientX);
  }

  function handleTouchStart(event) {
    const touch = event.touches?.[0];

    if (!touch) return;

    event.preventDefault();
    startDragFromClientX(touch.clientX);
  }

  function handleKeyboardNavigation(event, targetWorkspace) {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();

    scrollSidebarToWorkspace(targetWorkspace.key);
    navigate(targetWorkspace.path);
  }

  return (
    <div
      ref={switcherRef}
      className={`workspace-switcher ceos-workspace-switcher ${isDragging ? 'is-dragging' : ''}`.trim()}
      style={{ '--visual-index': String(isDragging ? visualIndex : activeIndex) }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      role="tablist"
      aria-label="Workspace selector"
    >
      <style>{workspaceSwitcherCss}</style>

      <div className="ceos-workspace-thumb" />

      {WORKSPACES.map((item, index) => (
        <div
          key={item.key}
          role="tab"
          tabIndex={0}
          aria-selected={workspace === item.key}
          className={`ceos-workspace-option ${highlightedIndex === index ? 'is-active' : ''}`.trim()}
          onKeyDown={(event) => handleKeyboardNavigation(event, item)}
        >
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}