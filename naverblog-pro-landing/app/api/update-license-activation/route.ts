import { NextRequest, NextResponse } from "next/server";
import { GoogleSheetsService } from "../../../lib/google-sheets";

export async function POST(request: NextRequest) {
  try {
    const { orderId, licenseKey, hardwareId } = await request.json();

    if (!orderId || !licenseKey || !hardwareId) {
      return NextResponse.json(
        {
          success: false,
          message: "주문번호, 라이센스키, 하드웨어ID가 모두 필요합니다.",
        },
        { status: 400 }
      );
    }

    const sheetsService = new GoogleSheetsService();

    // 라이센스 활성화 정보 업데이트
    await sheetsService.updateLicenseActivation({
      주문번호: orderId,
      라이센스키: licenseKey,
      하드웨어ID: hardwareId,
      활성화일시: new Date().toISOString(),
      상태: "active",
    });

    return NextResponse.json({
      success: true,
      message: "라이센스 활성화 정보가 업데이트되었습니다.",
    });
  } catch (error) {
    console.error("라이센스 활성화 업데이트 중 오류:", error);

    return NextResponse.json(
      {
        success: false,
        message: "라이센스 활성화 업데이트 중 오류가 발생했습니다.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
