import dotenv from "dotenv";
import nodemailer from "nodemailer";

// 환경변수 로드
dotenv.config();

async function debugGmail() {
  console.log("=== Gmail 설정 디버그 ===");

  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;

  console.log("\n📋 환경변수:");
  console.log("EMAIL_USER:", EMAIL_USER);
  console.log(
    "EMAIL_PASS 첫 4자리:",
    EMAIL_PASS ? EMAIL_PASS.substring(0, 4) + "..." : "undefined"
  );
  console.log("EMAIL_PASS 길이:", EMAIL_PASS ? EMAIL_PASS.length : "undefined");

  if (!EMAIL_USER || !EMAIL_PASS) {
    console.log("❌ 환경변수가 설정되지 않았습니다");
    return;
  }

  // 여러 설정으로 테스트
  const configurations = [
    {
      name: "설정 1: service gmail",
      config: {
        service: "gmail",
        auth: { user: EMAIL_USER, pass: EMAIL_PASS },
      },
    },
    {
      name: "설정 2: smtp.gmail.com 587",
      config: {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: { user: EMAIL_USER, pass: EMAIL_PASS },
      },
    },
    {
      name: "설정 3: smtp.gmail.com 465",
      config: {
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user: EMAIL_USER, pass: EMAIL_PASS },
      },
    },
  ];

  for (const { name, config } of configurations) {
    console.log(`\n🔧 ${name} 테스트...`);

    try {
      const transporter = nodemailer.createTransport(config);
      await transporter.verify();
      console.log(`✅ ${name} 성공!`);

      // 성공한 설정으로 이메일 발송 테스트
      console.log("📧 이메일 발송 테스트...");
      const result = await transporter.sendMail({
        from: EMAIL_USER,
        to: EMAIL_USER,
        subject: "네이버 블로그 자동화 - Gmail 테스트",
        html: `
          <h2>Gmail 연결 테스트 성공!</h2>
          <p>이메일 발송 시스템이 정상적으로 작동합니다.</p>
          <p>테스트 시간: ${new Date().toLocaleString("ko-KR")}</p>
        `,
      });

      console.log(`✅ 이메일 발송 성공! Message ID: ${result.messageId}`);
      console.log(`📬 ${EMAIL_USER} 에서 이메일을 확인하세요!`);
      return; // 성공하면 종료
    } catch (error) {
      console.log(`❌ ${name} 실패:`, error.message);
    }
  }

  console.log("\n💡 해결 방법:");
  console.log("1. Google 계정에서 2단계 인증이 활성화되어 있는지 확인");
  console.log("2. 앱 비밀번호가 올바르게 생성되었는지 확인");
  console.log('3. Gmail 계정에서 "덜 안전한 앱 액세스" 허용 필요할 수 있음');
  console.log("4. Google 계정이 기업용(G Suite)인 경우 추가 설정 필요");
}

debugGmail().catch(console.error);
