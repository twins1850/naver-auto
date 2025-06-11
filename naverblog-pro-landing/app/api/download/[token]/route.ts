import { NextRequest, NextResponse } from "next/server";
import { AdminBackendClient } from "../../../../lib/admin-backend-client.js";

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;

    console.log("🔍 다운로드 요청 토큰:", token);

    if (!token) {
      return NextResponse.json(
        { error: "토큰이 필요합니다." },
        { status: 400 }
      );
    }

    // 관리자 백엔드에서 토큰 검증 및 다운로드 파일 요청
    const adminBackend = new AdminBackendClient();

    try {
      console.log("🌐 백엔드에서 다운로드 파일 요청 중...");

      const response = await fetch(
        `${adminBackend.baseURL}/purchases/download/${token}`,
        {
          method: "GET",
          signal: AbortSignal.timeout(30000), // 30초 타임아웃
        }
      );

      if (!response.ok) {
        console.error("❌ 백엔드 다운로드 실패:", response.status);

        // 백엔드 실패 시 임시 GitHub 릴리즈 페이지로 리다이렉트
        return NextResponse.redirect(
          "https://github.com/your-repo/releases/latest"
        );
      }

      // 백엔드에서 파일 스트림 받아서 그대로 전달
      const fileBuffer = await response.arrayBuffer();

      console.log(
        "✅ 다운로드 파일 전달 완료:",
        fileBuffer.byteLength,
        "bytes"
      );

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Disposition": "attachment; filename=NaverBlogAuto.exe",
        },
      });
    } catch (backendError) {
      console.error("❌ 백엔드 연동 오류:", backendError);

      // 백엔드 연동 실패 시 GitHub 릴리즈나 다른 다운로드 서버로 리다이렉트
      return NextResponse.redirect(
        process.env.FALLBACK_DOWNLOAD_URL ||
          "https://github.com/your-repo/releases/latest"
      );
    }
  } catch (error: any) {
    console.error("💥 다운로드 API 오류:", error);

    return NextResponse.json(
      {
        error: "다운로드 중 오류가 발생했습니다.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
