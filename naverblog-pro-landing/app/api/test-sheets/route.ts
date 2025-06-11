import { NextRequest, NextResponse } from "next/server";
import { GoogleSheetsService } from "@/lib/google-sheets";

export async function GET(request: NextRequest) {
  try {
    console.log("Google Sheets 연결 테스트 시작");
    const googleSheetsService = new GoogleSheetsService();

    // 환경변수 확인
    const hasSpreadsheetId = !!process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const hasServiceAccount = !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const hasPrivateKey = !!process.env.GOOGLE_PRIVATE_KEY;

    console.log("환경변수 확인:", {
      hasSpreadsheetId,
      hasServiceAccount,
      hasPrivateKey,
    });

    // 간단한 데이터 조회 테스트
    const allData = await googleSheetsService.getAllData();

    return NextResponse.json({
      success: true,
      message: "Google Sheets 연결 성공",
      environment: {
        hasSpreadsheetId,
        hasServiceAccount,
        hasPrivateKey,
      },
      dataLength: allData ? allData.length : 0,
      hasHeaders: allData && allData.length > 0,
      headers: allData && allData.length > 0 ? allData[0] : null,
      recentData: allData && allData.length > 1 ? allData.slice(-3) : [],
      totalRows: allData ? allData.length - 1 : 0,
    });
  } catch (error) {
    console.error("Google Sheets 연결 테스트 실패:", error);
    return NextResponse.json(
      {
        error: "Google Sheets 연결 실패",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
