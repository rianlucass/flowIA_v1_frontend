import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '@/store/uiStore';

describe('useUIStore', () => {
  beforeEach(() => {
    useUIStore.setState({ isSidebarOpen: false });
  });

  it('starts with sidebar closed', () => {
    expect(useUIStore.getState().isSidebarOpen).toBe(false);
  });

  it('can open sidebar', () => {
    useUIStore.getState().openSidebar();
    expect(useUIStore.getState().isSidebarOpen).toBe(true);
  });

  it('can close sidebar', () => {
    useUIStore.getState().openSidebar();
    useUIStore.getState().closeSidebar();
    expect(useUIStore.getState().isSidebarOpen).toBe(false);
  });

  it('can toggle sidebar', () => {
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().isSidebarOpen).toBe(true);

    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().isSidebarOpen).toBe(false);
  });
});
