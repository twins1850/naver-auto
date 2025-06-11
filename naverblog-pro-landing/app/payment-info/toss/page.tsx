"use client";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PaymentInfo {
  productName: string;
  amount: number;
  accountIds: number;
  postsPerAccount: number;
  months: number;
  discountRate: number;
  email?: string;
  name?: string;
  phone?: string;
}

export default function TossPaymentPage() {
  return (
    <Suspense>
      <TossPaymentPageInner />
    </Suspense>
  );
}

function TossPaymentPageInner() {
  const searchParams = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);

  useEffect(() => {
    // URL 파라미터에서 정보 추출
    const productName = searchParams.get("productName") || "blog-pro 1.1";
    const amount = parseInt(searchParams.get("amount") || "99000");
    const accountIds = parseInt(searchParams.get("accountIds") || "1");
    const postsPerAccount = parseInt(
      searchParams.get("postsPerAccount") || "1"
    );
    const months = parseInt(searchParams.get("months") || "1");
    const discountRate = parseInt(searchParams.get("discountRate") || "0");
    const email = searchParams.get("email") || "";
    const name = searchParams.get("name") || "";
    const phone = searchParams.get("phone") || "";

    setPaymentInfo({
      productName,
      amount,
      accountIds,
      postsPerAccount,
      months,
      discountRate,
      email,
      name,
      phone,
    });
  }, [searchParams]);

  const handleTossPay = async () => {
    console.log("🎯 토스 결제 버튼 클릭됨!");
    console.log("💰 결제 정보:", paymentInfo);

    if (!paymentInfo) {
      alert("결제 정보를 불러오는 중입니다. 잠시만 기다려주세요.");
      return;
    }

    try {
      // .env에서 클라이언트 키를 불러오기 (NEXT_PUBLIC_ 접두사 필요)
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
      console.log("🔑 토스 클라이언트 키:", clientKey ? "설정됨" : "없음");

      if (!clientKey) {
        alert(
          "토스 클라이언트 키가 설정되지 않았습니다. .env 파일을 확인해주세요."
        );
        return;
      }

      console.log("📦 토스 SDK 로딩 중...");
      const tossPayments = await loadTossPayments(clientKey);
      console.log("✅ 토스 SDK 로딩 완료");

      // 고유 주문번호 생성 (한글 제거 후 영문/숫자/특수문자만 사용)
      const cleanProductName = paymentInfo.productName
        .replace(/개월/g, "months") // 한글 "개월"을 영문 "months"로 변환
        .replace(/[^\w\-_]/g, "-") // 영문/숫자/하이픈/언더스코어가 아닌 모든 문자를 하이픈으로 변환 (점 포함)
        .replace(/-+/g, "-") // 연속된 하이픈을 하나로 합침
        .replace(/^-|-$/g, ""); // 앞뒤 하이픈 제거

      const orderId = `${cleanProductName}-${Date.now()}`;

      // 상품명 생성
      const orderName = `NaverBlog Pro ${paymentInfo.productName}`;

      console.log("🛒 결제 요청 파라미터:", {
        amount: paymentInfo.amount,
        orderId,
        orderName,
      });

      // 결제 요청 (공식 문서 기준 파라미터 보완)
      console.log("🚀 토스 결제 요청 시작...");
      const successUrl =
        `${window.location.origin}/payment-info/success?` +
        `email=${encodeURIComponent(paymentInfo.email || "")}` +
        `&name=${encodeURIComponent(paymentInfo.name || "")}` +
        `&phone=${encodeURIComponent(paymentInfo.phone || "")}` +
        `&accountCount=${paymentInfo.accountIds}` +
        `&postCount=${paymentInfo.postsPerAccount}` +
        `&months=${paymentInfo.months}`;
      const failUrl = `${window.location.origin}/payment-info/fail`;
      const payment = await tossPayments.requestPayment("카드", {
        amount: paymentInfo.amount, // 동적 결제 금액
        orderId: orderId, // 고유 주문번호 (6자 이상 64자 이하)
        orderName: orderName, // 최대 100자
        customerName: paymentInfo.name || "고객", // 최대 100자
        customerEmail: paymentInfo.email || "customer@naverblogpro.com", // 최대 100자
        customerMobilePhone: paymentInfo.phone || "01000000000", // 8-15자 숫자만 (공식 문서 권장)
        successUrl,
        failUrl,
        // 공식 문서에서 권장하는 추가 파라미터들
        windowTarget: "self", // self 또는 iframe (모바일에서는 self 권장)
        metadata: {
          // 최대 5개 키-값 쌍, 키 40자 이하, 값 500자 이하
          serviceType: "NaverBlogPro",
          productCode: paymentInfo.productName,
          accountIds: paymentInfo.accountIds.toString(),
          postsPerAccount: paymentInfo.postsPerAccount.toString(),
          months: paymentInfo.months.toString(),
        },
      });
      console.log("✅ 토스 결제 요청 완료:", payment);
    } catch (error) {
      console.error("❌ 결제 요청 중 오류 발생:", error);

      // 에러 타입에 따른 상세 처리
      if (error instanceof Error) {
        const errorMessage = error.message;

        // 사용자가 결제를 취소한 경우
        if (
          errorMessage.includes("결제를 취소") ||
          errorMessage.includes("USER_CANCEL") ||
          errorMessage.includes("취소")
        ) {
          const shouldRetry = confirm(
            "결제가 취소되었습니다.\n\n다시 결제를 진행하시겠습니까?\n\n" +
              "• 예: 다시 결제하기\n" +
              "• 아니오: 가격 계산기로 돌아가기"
          );

          if (shouldRetry) {
            // 다시 결제 버튼 클릭과 같은 효과
            handleTossPay();
          } else {
            // 가격 계산기로 돌아가기
            window.location.href = "/payment-info";
          }
        } else {
          // 기타 오류의 경우
          alert(
            `결제 중 오류가 발생했습니다.\n\n` +
              `오류 내용: ${errorMessage}\n\n` +
              `잠시 후 다시 시도해 주세요.`
          );
        }
      } else {
        // 알 수 없는 오류
        alert("알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      }
    }
  };

  if (!paymentInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <p>결제 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          NaverBlog Pro 결제
        </h1>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-3">
            📋 결제 상세 정보
          </h3>
          <div className="space-y-2 text-sm text-blue-600">
            <div className="flex justify-between">
              <span>상품코드:</span>
              <span className="font-semibold">{paymentInfo.productName}</span>
            </div>
            <div className="flex justify-between">
              <span>아이디 수:</span>
              <span>{paymentInfo.accountIds}개</span>
            </div>
            <div className="flex justify-between">
              <span>아이디당 글 수:</span>
              <span>{paymentInfo.postsPerAccount}개</span>
            </div>
            <div className="flex justify-between">
              <span>총 일일 글 발행:</span>
              <span className="font-semibold text-blue-800">
                {paymentInfo.accountIds * paymentInfo.postsPerAccount}개
              </span>
            </div>
            <div className="flex justify-between">
              <span>결제 기간:</span>
              <span>{paymentInfo.months}개월</span>
            </div>
            {paymentInfo.discountRate > 0 && (
              <div className="flex justify-between text-red-600">
                <span>할인율:</span>
                <span>{paymentInfo.discountRate}%</span>
              </div>
            )}
            <hr className="my-2" />
            <div className="flex justify-between text-lg font-bold text-blue-800">
              <span>최종 결제금액:</span>
              <span>₩{paymentInfo.amount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-12 px-6 w-full bg-green-600 hover:bg-green-700 text-lg py-3"
          onClick={handleTossPay}
        >
          토스(Toss)로 결제하기
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-arrow-right ml-2 h-5 w-5"
          >
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </button>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">🔒 안전한 토스 결제 시스템</p>
          <p className="text-xs text-gray-400">
            결제 완료 후 라이선스가 자동 발급됩니다
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/payment-info"
            className="inline-flex items-center text-green-600 hover:underline text-sm"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> 가격 계산기로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
