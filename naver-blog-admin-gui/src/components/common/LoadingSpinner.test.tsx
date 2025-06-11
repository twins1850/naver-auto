import React from "react";
import { render, screen } from "@testing-library/react";
import LoadingSpinner from "./LoadingSpinner";

describe("LoadingSpinner", () => {
  it("기본 메시지와 스피너가 렌더링된다", () => {
    render(<LoadingSpinner />);
    expect(screen.getByText("로딩 중...")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("커스텀 메시지가 표시된다", () => {
    render(<LoadingSpinner message="데이터 불러오는 중..." />);
    expect(screen.getByText("데이터 불러오는 중...")).toBeInTheDocument();
  });
});
