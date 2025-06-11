import { create } from "zustand";
import { client, API_ENDPOINTS } from "../api";
import type { Notice, PaginatedResponse } from "../api";

interface NoticesState {
  notices: Notice[];
  currentNotice: Notice | null;
  isLoading: boolean;
  error: string | null;
  fetchNotices: () => Promise<void>;
  fetchNotice: (id: number) => Promise<void>;
  createNotice: (
    data: Omit<Notice, "id" | "created_at" | "updated_at">,
  ) => Promise<void>;
  updateNotice: (id: number, data: Partial<Notice>) => Promise<void>;
  deleteNotice: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useNoticesStore = create<NoticesState>((set) => ({
  notices: [],
  currentNotice: null,
  isLoading: false,
  error: null,

  fetchNotices: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await client.get<PaginatedResponse<Notice>>(
        API_ENDPOINTS.NOTICES.LIST,
      );
      set({ notices: response.data.items, isLoading: false });
    } catch (error) {
      set({
        error: "공지사항 목록을 불러오는데 실패했습니다.",
        isLoading: false,
      });
      throw error;
    }
  },

  fetchNotice: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      const response = await client.get<Notice>(
        API_ENDPOINTS.NOTICES.DETAIL(id),
      );
      set({ currentNotice: response.data, isLoading: false });
    } catch (error) {
      set({ error: "공지사항을 불러오는데 실패했습니다.", isLoading: false });
      throw error;
    }
  },

  createNotice: async (data) => {
    try {
      set({ isLoading: true, error: null });
      await client.post(API_ENDPOINTS.NOTICES.CREATE, data);
      const response = await client.get<PaginatedResponse<Notice>>(
        API_ENDPOINTS.NOTICES.LIST,
      );
      set({ notices: response.data.items, isLoading: false });
    } catch (error) {
      set({ error: "공지사항 작성에 실패했습니다.", isLoading: false });
      throw error;
    }
  },

  updateNotice: async (id: number, data) => {
    try {
      set({ isLoading: true, error: null });
      await client.put(API_ENDPOINTS.NOTICES.UPDATE(id), data);
      const response = await client.get<PaginatedResponse<Notice>>(
        API_ENDPOINTS.NOTICES.LIST,
      );
      set({ notices: response.data.items, isLoading: false });
    } catch (error) {
      set({ error: "공지사항 수정에 실패했습니다.", isLoading: false });
      throw error;
    }
  },

  deleteNotice: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      await client.delete(API_ENDPOINTS.NOTICES.DELETE(id));
      const response = await client.get<PaginatedResponse<Notice>>(
        API_ENDPOINTS.NOTICES.LIST,
      );
      set({ notices: response.data.items, isLoading: false });
    } catch (error) {
      set({ error: "공지사항 삭제에 실패했습니다.", isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
