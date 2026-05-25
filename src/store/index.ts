import { create } from "zustand";
import type { NotificationPayload, ModalState, Wallet } from "@/types";

interface NotificationState {
  notifications: NotificationPayload[];
  addNotification: (notification: NotificationPayload) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (notification: NotificationPayload) =>
    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, 50),
    })),
  removeNotification: (id: string) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  markAsRead: (id: string) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    })),
}));

interface UIState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  modals: Record<string, ModalState>;
  openModal: (id: string, data?: any) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  modals: {},
  openModal: (id: string, data?: any) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [id]: { isOpen: true, data },
      },
    })),
  closeModal: (id: string) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [id]: { isOpen: false },
      },
    })),
  closeAllModals: () => set({ modals: {} }),
}));

interface WalletState {
  wallet: Wallet | null;
  setWallet: (wallet: Wallet | null) => void;
  updateBalance: (amount: number) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  wallet: null,
  setWallet: (wallet: Wallet | null) => set({ wallet }),
  updateBalance: (amount: number) =>
    set((state) => ({
      wallet: state.wallet
        ? {
            ...state.wallet,
            balance: state.wallet.balance + amount,
          }
        : null,
    })),
}));

interface SMSState {
  isSending: boolean;
  setIsSending: (sending: boolean) => void;
}

export const useSMSStore = create<SMSState>((set) => ({
  isSending: false,
  setIsSending: (sending: boolean) => set({ isSending: sending }),
}));
