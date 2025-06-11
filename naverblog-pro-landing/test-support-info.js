import dotenv from "dotenv";

// 환경변수 로드
dotenv.config();

function testSupportInfo() {
  console.log("📞 고객 지원 정보 테스트");

  const supportEmail = process.env.SUPPORT_EMAIL;
  const kakaoId = process.env.KAKAO_ID;

  console.log("\n📋 현재 설정:");
  console.log("고객 지원 이메일:", supportEmail);
  console.log("카카오톡 ID:", kakaoId);

  // 이메일 템플릿에서 사용되는 방식 시뮬레이션
  const emailTemplate = `
    <h3>고객 지원</h3>
    <p>궁금한 점이 있으시면 언제든지 연락해주세요:</p>
    <ul>
      <li>📧 이메일: ${supportEmail || "support@example.com"}</li>
      <li>💬 카카오톡: ${kakaoId || "@naverblog"}</li>
    </ul>
  `;

  console.log("\n📧 이메일 템플릿 미리보기:");
  console.log("----------------------------------------");
  console.log("고객 지원");
  console.log("궁금한 점이 있으시면 언제든지 연락해주세요:");
  console.log(`• 이메일: ${supportEmail || "support@example.com"}`);
  console.log(`• 카카오톡: ${kakaoId || "@naverblog"}`);
  console.log("----------------------------------------");

  // 설정 상태 체크
  if (supportEmail === "support@your-domain.com" || !supportEmail) {
    console.log(
      "\n⚠️  고객 지원 이메일이 기본값입니다. 실제 이메일로 변경해주세요!"
    );
  } else {
    console.log("\n✅ 고객 지원 이메일이 설정되었습니다.");
  }

  if (kakaoId === "@naverblog" || !kakaoId) {
    console.log("⚠️  카카오톡 ID가 기본값입니다. 실제 ID로 변경해주세요!");
  } else {
    console.log("✅ 카카오톡 ID가 설정되었습니다.");
  }

  console.log("\n💡 변경 방법:");
  console.log("1. .env 파일에서 SUPPORT_EMAIL과 KAKAO_ID 수정");
  console.log("2. 서버 재시작 (npm run dev)");
  console.log("3. 이 테스트 다시 실행하여 확인");
}

testSupportInfo();
