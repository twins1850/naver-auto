import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NotificationSnackbar from "./NotificationSnackbar";
import { useUIStore } from "../../store";

// Mock the store
jest.mock("../../store", () => ({
  useUIStore: jest.fn(),
}));

describe("NotificationSnackbar", () => {
  const mockClearNotification = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useUIStore as jest.Mock).mockReturnValue({
      notification: { type: "success", message: "" },
      clearNotification: mockClearNotification,
    });
  });

  it("메시지가 없을 때는 Snackbar가 표시되지 않는다", () => {
    render(<NotificationSnackbar />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("성공 메시지가 올바르게 표시된다", () => {
    (useUIStore as jest.Mock).mockReturnValue({
      notification: { type: "success", message: "저장되었습니다." },
      clearNotification: mockClearNotification,
    });

    render(<NotificationSnackbar />);
    expect(screen.getByText("저장되었습니다.")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveClass("MuiAlert-filledSuccess");
  });

  it("에러 메시지가 올바르게 표시된다", () => {
    (useUIStore as jest.Mock).mockReturnValue({
      notification: { type: "error", message: "오류가 발생했습니다." },
      clearNotification: mockClearNotification,
    });

    render(<NotificationSnackbar />);
    expect(screen.getByText("오류가 발생했습니다.")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveClass("MuiAlert-filledError");
  });

  it("닫기 버튼 클릭 시 clearNotification이 호출된다", async () => {
    (useUIStore as jest.Mock).mockReturnValue({
      notification: { type: "info", message: "알림 메시지" },
      clearNotification: mockClearNotification,
    });

    render(<NotificationSnackbar />);
    const closeButton = screen.getByRole("button", { name: "Close" });
    await userEvent.click(closeButton);

    expect(mockClearNotification).toHaveBeenCalledTimes(1);
  });

  it("자동으로 6초 후에 사라진다", async () => {
    jest.useFakeTimers();

    (useUIStore as jest.Mock).mockReturnValue({
      notification: { type: "info", message: "자동 닫힘 테스트" },
      clearNotification: mockClearNotification,
    });

    render(<NotificationSnackbar />);

    act(() => {
      jest.advanceTimersByTime(6000);
    });

    await waitFor(() => {
      expect(mockClearNotification).toHaveBeenCalledTimes(1);
    });

    jest.useRealTimers();
  });
});
