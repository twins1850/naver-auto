import { NextRequest, NextResponse } from "next/server";
import { testEmailConnection, sendLicenseEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    // 환경변수 확인
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    console.log("환경변수 확인:");
    console.log("EMAIL_USER:", emailUser);
    console.log("EMAIL_PASS 길이:", emailPass ? emailPass.length : "undefined");

    if (!emailUser || !emailPass) {
      return NextResponse.json(
        {
          success: false,
          error: "환경변수가 설정되지 않았습니다",
          details: {
            emailUser: !!emailUser,
            emailPass: !!emailPass,
          },
        },
        { status: 500 }
      );
    }

    // 이메일 연결 테스트
    const connectionResult = await testEmailConnection();

    if (!connectionResult) {
      return NextResponse.json(
        {
          success: false,
          error: "Gmail 연결 실패",
        },
        { status: 500 }
      );
    }

    // 테스트 이메일 발송
    const { email } = await request.json();

    const testLicenseInfo = {
      licenseKey: "NAVER-TEST-1234-ABCD-5678",
      customerName: "테스트 사용자",
      customerEmail: email || emailUser,
      productType: "standard",
      createdAt: new Date().toISOString(),
      expiryDate: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      ).toISOString(),
    };

    const emailResult = await sendLicenseEmail(testLicenseInfo);

    return NextResponse.json({
      success: true,
      message: "Gmail 연결 및 이메일 발송 성공!",
      connectionResult,
      emailResult,
    });
  } catch (error) {
    console.error("이메일 테스트 오류:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "알 수 없는 오류",
      },
      { status: 500 }
    );
  }
}
