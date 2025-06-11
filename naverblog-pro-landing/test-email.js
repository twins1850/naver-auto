import dotenv from "dotenv";
import { testEmailConnection, sendLicenseEmail } from "./lib/email.js";

// 환경변수 로드
dotenv.config();

async function testEmail() {
  console.log("=== Gmail 연결 테스트 시작 ===");

  // 환경변수 확인
  console.log("\n📋 환경변수 확인:");
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log(
    "EMAIL_PASS 길이:",
    process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : "undefined"
  );

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("❌ 환경변수가 설정되지 않았습니다");
    return;
  }

  try {
    // 1. 연결 테스트
    console.log("\n🔌 Gmail SMTP 연결 테스트...");
    const connectionResult = await testEmailConnection();

    if (connectionResult) {
      console.log("✅ Gmail 연결 성공!");
    } else {
      console.log("❌ Gmail 연결 실패");
      return;
    }

    // 2. 테스트 이메일 발송
    console.log("\n📧 테스트 이메일 발송...");
    const testLicenseInfo = {
      licenseKey: "NAVER-TEST-1234-ABCD-5678",
      customerName: "테스트 사용자",
      customerEmail: "yegreen2010@gmail.com",
      productType: "standard",
      createdAt: new Date().toISOString(),
      expiryDate: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      ).toISOString(),
    };

    const emailResult = await sendLicenseEmail(testLicenseInfo);

    if (emailResult.success) {
      console.log("✅ 테스트 이메일 발송 성공!");
      console.log("📨 Message ID:", emailResult.messageId);
      console.log("📬 받는 사람: yegreen2010@gmail.com");
      console.log("\n🎉 Gmail 설정이 완벽하게 완료되었습니다!");
    } else {
      console.log("❌ 이메일 발송 실패:", emailResult.error);
    }
  } catch (error) {
    console.log("❌ 테스트 중 오류 발생:", error.message);
  }
}

testEmail();
