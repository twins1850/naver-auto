import { NextRequest, NextResponse } from "next/server";
import { LicenseService } from "../../../lib/license-service.js";

export async function POST(request: NextRequest) {
  try {
    console.log("🎯 라이선스 발급 API 호출됨");
    const customerInfo = await request.json();
    console.log("📋 수신된 고객 정보:", JSON.stringify(customerInfo, null, 2));

    // 필수 필드 검증
    if (!customerInfo.name || !customerInfo.email || !customerInfo.orderId) {
      console.error("❌ 필수 필드 누락:", {
        name: !!customerInfo.name,
        email: !!customerInfo.email,
        orderId: !!customerInfo.orderId,
      });
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다. (이름, 이메일, 주문번호)" },
        { status: 400 }
      );
    }

    console.log("✅ 필수 필드 검증 통과");
    console.log("🚀 라이선스 발급 서비스 시작...");

    // 라이선스 발급 서비스 실행
    const licenseService = new LicenseService();
    const result: any = await licenseService.issueLicense(customerInfo);

    console.log("📊 라이선스 발급 결과:", {
      success: result.success,
      licenseKey: result.licenseKey ? "생성됨" : "없음",
      temporaryLicense: result.temporaryLicense ? "생성됨" : "없음",
      stepResults: result.stepResults,
      errorMessage: result.error,
    });

    if (result.success) {
      console.log("🎉 라이선스 발급 API 성공 완료");
      return NextResponse.json({
        success: true,
        message: result.message,
        licenseKey: result.licenseKey,
        emailMessageId: result.emailMessageId,
        temporaryLicense: result.temporaryLicense,
        stepResults: result.stepResults,
      });
    } else {
      console.error("❌ 라이선스 발급 실패:", result.message);
      return NextResponse.json(
        {
          error: result.message,
          details: result.error,
          stepResults: result.stepResults,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("💥 라이선스 발급 API 치명적 오류:", error);
    console.error("📍 오류 스택:", error.stack);

    return NextResponse.json(
      {
        error: "서버 내부 오류가 발생했습니다.",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// 라이선스 재발송 API
export async function PUT(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "이메일이 필요합니다." },
        { status: 400 }
      );
    }

    console.log("라이선스 재발송 요청:", email);

    const licenseService = new LicenseService();
    const result: any = await licenseService.resendLicense(email);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        emailMessageId: result.emailMessageId,
      });
    } else {
      return NextResponse.json(
        {
          error: result.message,
          details: result.error,
        },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error("라이선스 재발송 API 오류:", error);
    return NextResponse.json(
      { error: "서버 내부 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
