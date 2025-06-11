import { NextRequest, NextResponse } from "next/server";

// 통합 구조로 변경: 구매 정보는 issue-license에서 함께 처리됩니다.
// 이 API는 하위 호환성을 위해 유지하지만 실제로는 사용하지 않는 것을 권장합니다.
export async function POST(request: NextRequest) {
  try {
    console.warn(
      "save-customer API는 deprecated입니다. issue-license API에서 통합 처리됩니다."
    );

    const body = await request.json();

    const {
      name,
      email,
      phone,
      amount,
      accountCount,
      postCount,
      months,
      orderId,
      paymentKey,
      status = "결제완료",
    } = body;

    // 입력 데이터 검증
    if (
      !name ||
      !email ||
      !phone ||
      !amount ||
      !accountCount ||
      !postCount ||
      !months ||
      !orderId
    ) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 통합 구조 이후에는 구매 정보 저장을 하지 않음
    // issue-license API에서 addPurchaseData로 한 번에 처리됨
    console.log("구매 정보는 라이센스 발급 시 통합 처리됩니다:", {
      orderId,
      email,
    });

    return NextResponse.json({
      success: true,
      message: "구매 정보는 라이센스 발급 과정에서 통합 처리됩니다.",
      deprecated: true,
    });
  } catch (error) {
    console.error("save-customer API 오류:", error);
    return NextResponse.json(
      { error: "API 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
