import { NextRequest, NextResponse } from "next/server";
import { GoogleSheetsService } from "../../../../lib/google-sheets";

export async function GET(request: NextRequest) {
  try {
    const sheetsService = new GoogleSheetsService();
    const licenseData = await sheetsService.getLicenseData();

    return NextResponse.json(licenseData);
  } catch (error) {
    console.error("라이선스 데이터 조회 중 오류:", error);
    return NextResponse.json(
      { error: "라이선스 데이터 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}
