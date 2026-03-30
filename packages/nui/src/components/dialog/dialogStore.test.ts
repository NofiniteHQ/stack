import { describe, it, expect, vi, beforeEach } from 'vitest';
import { dialogStore, nui, toastEmitter } from './dialogStore';

describe('dialogStore & Vanilla UI Engine', () => {
  beforeEach(() => {
    // Reset the internal store state before each test
    dialogStore.setState({ isOpen: false, resolve: null });
  });

  describe('Core Store Mechanics', () => {
    it('initializes with the correct default state', () => {
      const state = dialogStore.getState();
      expect(state.isOpen).toBe(false);
      expect(state.resolve).toBeNull();
    });

    it('notifies subscribers when the state is updated', () => {
      const listenerMock = vi.fn();
      const unsubscribe = dialogStore.subscribe(listenerMock);

      dialogStore.setState({ isOpen: true });

      expect(listenerMock).toHaveBeenCalledTimes(1);
      expect(dialogStore.getState().isOpen).toBe(true);

      // Verify cleanup mechanism prevents memory leaks
      unsubscribe();
      dialogStore.setState({ isOpen: false });
      
      expect(listenerMock).toHaveBeenCalledTimes(1); // Should not increase
    });
  });

  describe('Dialog API Overlays', () => {
    it('updates state correctly when calling nui.confirm()', () => {
      nui.confirm('Are you sure?', { title: 'Warning', confirmText: 'Proceed' });

      const state = dialogStore.getState();
      expect(state.isOpen).toBe(true);
      expect(state.type).toBe('confirm');
      expect(state.message).toBe('Are you sure?');
      expect(state.title).toBe('Warning');
      expect(state.confirmText).toBe('Proceed');
      expect(typeof state.resolve).toBe('function');
    });

    it('updates state correctly when calling nui.alert()', () => {
      nui.alert('Task completed', { isDanger: false });

      const state = dialogStore.getState();
      expect(state.isOpen).toBe(true);
      expect(state.type).toBe('alert');
      expect(state.message).toBe('Task completed');
      expect(state.isDanger).toBe(false);
      expect(typeof state.resolve).toBe('function');
    });
  });

  describe('Toast Event Emitter Engine', () => {
    it('notifies registered toast listeners with the correct payload architecture', () => {
      const toastListenerMock = vi.fn();
      const unsubscribe = toastEmitter.subscribe(toastListenerMock);

      nui.success('Database connected', { duration: 3000 });

      expect(toastListenerMock).toHaveBeenCalledTimes(1);
      expect(toastListenerMock).toHaveBeenCalledWith({
        variant: 'success',
        message: 'Database connected',
        options: { duration: 3000 },
      });

      unsubscribe();
    });

    it('emits standard events for all supported semantic variants', () => {
      const toastListenerMock = vi.fn();
      toastEmitter.subscribe(toastListenerMock);

      nui.toast('Info');
      nui.error('Fatal');
      nui.warn('Careful');

      expect(toastListenerMock).toHaveBeenCalledTimes(3);
      expect(toastListenerMock.mock.calls[0][0].variant).toBe('default');
      expect(toastListenerMock.mock.calls[1][0].variant).toBe('error');
      expect(toastListenerMock.mock.calls[2][0].variant).toBe('warning');
    });
  });
});