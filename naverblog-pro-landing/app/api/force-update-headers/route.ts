import { NextRequest, NextResponse } from "next/server";
import { GoogleSheetsService } from "@/lib/google-sheets";

export async function POST(request: NextRequest) {
  try {
    console.log("시트 구조 강제 업데이트 시작");
    const googleSheetsService = new GoogleSheetsService();

    // 통합 헤더로 강제 업데이트
    await googleSheetsService.forceUpdateHeaders();

    console.log("통합 헤더 업데이트 완료");

    // 업데이트된 데이터 확인
    const allData = await googleSheetsService.getAllData();

    return NextResponse.json({
      success: true,
      message: "시트가 통합 구조로 업데이트되었습니다",
      newHeaders: allData && allData.length > 0 ? allData[0] : null,
      dataLength: allData ? allData.length : 0,
    });
  } catch (error) {
    console.error("시트 구조 업데이트 실패:", error);
    return NextResponse.json(
      {
        error: "시트 구조 업데이트 실패",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
