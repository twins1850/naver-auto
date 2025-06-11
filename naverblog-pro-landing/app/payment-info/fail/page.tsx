"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentFailPage() {
  return (
    <Suspense>
      <PaymentFailPageInner />
    </Suspense>
  );
}

function PaymentFailPageInner() {
  const searchParams = useSearchParams();
  const [errorInfo, setErrorInfo] = useState({
    code: "",
    message: "",
    orderId: "",
    productName: "",
  });

  useEffect(() => {
    // URL 쿼리 파라미터에서 에러 정보 추출
    const code = searchParams.get("code") || "";
    const message = searchParams.get("message") || "";
    const orderId = searchParams.get("orderId") || "";

    // 주문상품명 추출 (orderId에서 상품명 부분만 추출)
    let productName = "";
    if (orderId) {
      // 예: blog-pro-3-4-6months-1748944162864 → blog-pro-3-4-6months
      const match = orderId.match(/^(.*?)-(\d{10,})$/);
      productName = match
        ? match[1].replace(/-/g, " ")
        : orderId.replace(/-/g, " ");
    }

    setErrorInfo({
      code,
      message,
      orderId,
      productName,
    });

    console.log("결제 실패 정보:", { code, message, orderId, productName });
  }, [searchParams]);

  const handleRetryPayment = () => {
    window.location.href = "/payment-info/toss";
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleGoPaymentInfo = () => {
    window.location.href = "/payment-info";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {/* 실패 아이콘 */}
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          결제에 실패했습니다
        </h1>

        <p className="text-gray-600 mb-6">결제 처리 중 문제가 발생했습니다.</p>

        {/* 에러 정보 */}
        {(errorInfo.message || errorInfo.productName) && (
          <div className="bg-red-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-red-800 mb-3">오류 정보</h3>
            <div className="space-y-2 text-sm">
              {errorInfo.message && (
                <div className="flex flex-col">
                  <span className="text-red-600 mb-1">오류 메시지:</span>
                  <span className="text-red-800 text-xs break-words">
                    {errorInfo.message}
                  </span>
                </div>
              )}
              {errorInfo.productName && (
                <div className="flex justify-between">
                  <span className="text-red-600">주문상품:</span>
                  <span className="font-mono text-xs">
                    {errorInfo.productName}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 일반적인 해결방법 안내 */}
        <div className="bg-yellow-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-yellow-800 mb-2">해결 방법</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• 카드 정보를 다시 확인해주세요</li>
            <li>• 결제 한도를 확인해주세요</li>
            <li>• 네트워크 상태를 확인해주세요</li>
            <li>• 잠시 후 다시 시도해주세요</li>
          </ul>
        </div>

        {/* 버튼들 */}
        <div className="space-y-3">
          <button
            onClick={handleRetryPayment}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
          >
            다시 결제하기
          </button>

          <button
            onClick={handleGoPaymentInfo}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-md transition-colors"
          >
            결제 정보로 돌아가기
          </button>

          <button
            onClick={handleGoHome}
            className="w-full bg-white hover:bg-gray-50 text-gray-600 font-medium py-3 px-4 rounded-md border border-gray-300 transition-colors"
          >
            홈으로 이동
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          ※ 문제가 지속되면 고객센터로 문의해주세요.
        </div>
      </div>
    </div>
  );
}
