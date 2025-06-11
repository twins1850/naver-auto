import React from "react";
import { render, screen } from "@testing-library/react";
import { Button } from "@mui/material";
import ErrorMessage from "./ErrorMessage";

describe("ErrorMessage", () => {
  it("기본 에러 메시지가 렌더링된다", () => {
    render(<ErrorMessage message="오류가 발생했습니다." />);
    expect(screen.getByText("오류가 발생했습니다.")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveClass("MuiAlert-standardError");
  });

  it("제목과 메시지가 모두 표시된다", () => {
    render(
      <ErrorMessage
        title="데이터 로딩 오류"
        message="데이터를 불러오는 중 문제가 발생했습니다."
      />,
    );
    expect(screen.getByText("데이터 로딩 오류")).toBeInTheDocument();
    expect(
      screen.getByText("데이터를 불러오는 중 문제가 발생했습니다."),
    ).toBeInTheDocument();
  });

  it("severity 속성이 올바르게 적용된다", () => {
    render(
      <ErrorMessage message="주의가 필요한 상황입니다." severity="warning" />,
    );
    expect(screen.getByRole("alert")).toHaveClass("MuiAlert-standardWarning");
  });

  it("action 버튼이 렌더링된다", () => {
    const actionButton = <Button>다시 시도</Button>;
    render(
      <ErrorMessage message="작업이 실패했습니다." action={actionButton} />,
    );
    expect(screen.getByText("다시 시도")).toBeInTheDocument();
  });

  it("info severity로 정보 메시지를 표시한다", () => {
    render(<ErrorMessage message="시스템 점검 중입니다." severity="info" />);
    expect(screen.getByRole("alert")).toHaveClass("MuiAlert-standardInfo");
    expect(screen.getByText("시스템 점검 중입니다.")).toBeInTheDocument();
  });
});
