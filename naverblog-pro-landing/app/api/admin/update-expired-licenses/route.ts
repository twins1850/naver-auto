import { NextRequest, NextResponse } from "next/server";
import { GoogleSheetsService } from "../../../../lib/google-sheets";

export async function POST(request: NextRequest) {
  try {
    const sheetsService = new GoogleSheetsService();

    // 만료된 라이센스 자동 업데이트
    const expiredCount = await sheetsService.updateExpiredLicenses();

    return NextResponse.json({
      success: true,
      message: `${expiredCount}개의 만료된 라이센스가 업데이트되었습니다.`,
      expiredCount,
    });
  } catch (error) {
    console.error("만료 라이센스 업데이트 중 오류:", error);

    return NextResponse.json(
      {
        success: false,
        message: "만료 라이센스 업데이트 중 오류가 발생했습니다.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const sheetsService = new GoogleSheetsService();

    // 만료된 라이센스 자동 업데이트 (GET 방식으로도 호출 가능)
    const expiredCount = await sheetsService.updateExpiredLicenses();

    return NextResponse.json({
      success: true,
      message: `${expiredCount}개의 만료된 라이센스가 업데이트되었습니다.`,
      expiredCount,
    });
  } catch (error) {
    console.error("만료 라이센스 업데이트 중 오류:", error);

    return NextResponse.json(
      {
        success: false,
        message: "만료 라이센스 업데이트 중 오류가 발생했습니다.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
