"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// 결제 정보 표시용 타입 추가
interface PaymentDetail {
  orderId: string;
  amount: number;
  approvedAt?: string; // 결제일시
  method?: string; // 결제수단
  cardCompany?: string; // 카드사명
  installmentPlanMonths?: number; // 할부개월
  email: string;
  name: string;
  phone: string;
  accountCount?: number; // 아이디 수
  postCount?: number; // 글 수
  months?: number; // 개월 수
}

export default function PaymentSuccessPage(props: {
  paymentDetail?: PaymentDetail;
}) {
  return (
    <Suspense>
      <PaymentSuccessPageInner {...props} />
    </Suspense>
  );
}

function PaymentSuccessPageInner(props: { paymentDetail?: PaymentDetail }) {
  const searchParams = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState({
    paymentKey: "",
    orderId: "",
    amount: "",
    email: "",
    name: "",
    phone: "",
    accountCount: "",
    postCount: "",
    months: "",
  });
  const [successTime, setSuccessTime] = useState<string>("");
  const [isDataSaved, setIsDataSaved] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [licenseStatus, setLicenseStatus] = useState<{
    isProcessing: boolean;
    isIssued: boolean;
    licenseKey?: string;
    message?: string;
    error?: string;
  }>({
    isProcessing: false,
    isIssued: false,
  });

  // 실제 결제 연동 시 props.paymentDetail이 있으면 그 값을 사용
  const detail = props.paymentDetail || {
    orderId: paymentInfo.orderId,
    amount: Number(paymentInfo.amount),
    approvedAt: successTime,
    method: undefined,
    cardCompany: undefined,
    installmentPlanMonths: undefined,
    email: paymentInfo.email,
    name: paymentInfo.name,
    phone: paymentInfo.phone,
    accountCount: Number(paymentInfo.accountCount),
    postCount: Number(paymentInfo.postCount),
    months: Number(paymentInfo.months),
  };

  // Google Sheets에 고객 정보 저장하는 함수 (deprecated - issueLicense에서 통합 처리됨)
  /*
  const saveCustomerData = async (customerData: any) => {
    try {
      const response = await fetch("/api/save-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      });

      if (response.ok) {
        console.log("고객 정보가 Google Sheets에 성공적으로 저장되었습니다.");
        setIsDataSaved(true);
      } else {
        console.error("고객 정보 저장 실패:", await response.text());
      }
    } catch (error) {
      console.error("고객 정보 저장 중 오류 발생:", error);
    }
  };
  */

  // 라이선스 자동 발급 함수
  const issueLicense = async (customerData: any) => {
    try {
      console.log("🚀 라이선스 발급 시작:", customerData);
      setLicenseStatus({ isProcessing: true, isIssued: false });

      const response = await fetch("/api/issue-license", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      });

      console.log("📥 라이선스 API 응답 상태:", response.status);
      const result = await response.json();
      console.log("📋 라이선스 API 응답 데이터:", result);

      if (response.ok && result.success) {
        console.log("✅ 라이선스 발급 성공:", result.licenseKey);
        setLicenseStatus({
          isProcessing: false,
          isIssued: true,
          licenseKey: result.licenseKey,
          message: result.message,
        });

        // Google Sheets 저장 성공 표시
        setIsDataSaved(true);
      } else {
        console.error("❌ 라이선스 발급 실패:", result.error);

        // 중복 주문 오류인 경우 특별 처리
        if (result.details === "DUPLICATE_ORDER") {
          setLicenseStatus({
            isProcessing: false,
            isIssued: true,
            message: "이미 처리된 주문입니다. 라이선스가 이미 발급되었습니다.",
          });
        } else {
          setLicenseStatus({
            isProcessing: false,
            isIssued: false,
            error: result.error || "라이선스 발급에 실패했습니다.",
          });
        }
      }
    } catch (error) {
      console.error("💥 라이선스 발급 중 네트워크 오류:", error);
      setLicenseStatus({
        isProcessing: false,
        isIssued: false,
        error: "라이선스 발급 중 오류가 발생했습니다.",
      });
    }
  };

  // 라이선스 재발송 함수
  const resendLicense = async () => {
    try {
      console.log("📧 라이선스 재발송 시작:", paymentInfo.email);
      setLicenseStatus((prev) => ({ ...prev, isProcessing: true }));

      const response = await fetch("/api/issue-license", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: paymentInfo.email }),
      });

      console.log("📥 재발송 API 응답 상태:", response.status);
      const result = await response.json();
      console.log("📋 재발송 API 응답 데이터:", result);

      if (response.ok && result.success) {
        console.log("✅ 라이선스 재발송 성공");
        setLicenseStatus((prev) => ({
          ...prev,
          isProcessing: false,
          message: result.message,
        }));
      } else {
        console.error("❌ 라이선스 재발송 실패:", result.error);
        setLicenseStatus((prev) => ({
          ...prev,
          isProcessing: false,
          error: result.error || "라이선스 재발송에 실패했습니다.",
        }));
      }
    } catch (error) {
      console.error("💥 라이선스 재발송 중 네트워크 오류:", error);
      setLicenseStatus((prev) => ({
        ...prev,
        isProcessing: false,
        error: "라이선스 재발송 중 오류가 발생했습니다.",
      }));
    }
  };

  useEffect(() => {
    // URL 쿼리 파라미터에서 결제 정보 추출
    const paymentKey = searchParams.get("paymentKey") || "";
    const orderId = searchParams.get("orderId") || "";
    const amount = searchParams.get("amount") || "";
    const email = searchParams.get("email") || "";
    const name = searchParams.get("name") || "";
    const phone = searchParams.get("phone") || "";
    const accountCount = searchParams.get("accountCount") || "";
    const postCount = searchParams.get("postCount") || "";
    const months = searchParams.get("months") || "";

    setPaymentInfo({
      paymentKey,
      orderId,
      amount,
      email,
      name,
      phone,
      accountCount,
      postCount,
      months,
    });

    const currentTime = new Date().toLocaleString("ko-KR", { hour12: false });
    setSuccessTime(currentTime);

    // 중복 처리 방지: sessionStorage를 사용하여 이미 처리된 주문인지 확인
    const processedKey = `processed_order_${orderId}`;
    const isAlreadyProcessed = sessionStorage.getItem(processedKey);

    if (isAlreadyProcessed) {
      console.log("이미 처리된 주문입니다:", orderId);
      setIsProcessed(true);
      setLicenseStatus({
        isProcessing: false,
        isIssued: true,
        message: "이미 처리된 주문입니다. 라이선스가 이미 발급되었습니다.",
      });
      return;
    }

    // Google Sheets에 고객 정보 저장 + 라이선스 자동 발급 (통합 처리)
    if (name && email && phone && orderId && amount && !isAlreadyProcessed) {
      // 처리 시작 표시
      sessionStorage.setItem(processedKey, "true");
      setIsProcessed(true);

      const customerData = {
        name,
        email,
        phone,
        amount: Number(amount),
        accountCount: Number(accountCount) || 1,
        postCount: Number(postCount) || 1,
        months: Number(months) || 1,
        orderId,
        paymentKey,
        status: "결제완료",
        productType: "standard", // 기본값, 필요시 수정
      };

      // 라이선스 자동 발급 (Google Sheets 저장 포함)
      issueLicense(customerData);

      console.log("결제 성공 정보:", customerData);
    }
  }, [searchParams]);

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleGoPaymentInfo = () => {
    window.location.href = "/payment-info";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {/* 성공 아이콘 */}
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          결제가 완료되었습니다!
        </h1>

        <p className="text-gray-600 mb-6">결제가 성공적으로 처리되었습니다.</p>

        {/* 중복 처리 방지 메시지 */}
        {isProcessed &&
          !licenseStatus.isProcessing &&
          !licenseStatus.isIssued && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-blue-800 text-sm">
                ⏳ 주문 처리가 완료되었습니다. 새로고침하지 마시고 잠시
                기다려주세요.
              </p>
            </div>
          )}

        {/* 데이터 저장 상태 표시 */}
        {isDataSaved && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <p className="text-green-800 text-sm">
              ✅ 고객 정보가 시스템에 자동으로 저장되었습니다.
            </p>
          </div>
        )}

        {/* 라이선스 발급 상태 표시 */}
        <div className="mb-4">
          {licenseStatus.isProcessing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <p className="text-blue-800 text-sm">라이선스 발급 중...</p>
              </div>
            </div>
          )}

          {licenseStatus.isIssued && licenseStatus.licenseKey && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">
                🎉 라이선스 발급 완료!
              </h4>
              <div className="bg-white border rounded p-3 mb-2">
                <p className="text-xs text-gray-600 mb-1">라이선스 키:</p>
                <p className="font-mono text-sm font-bold text-green-700 break-all">
                  {licenseStatus.licenseKey}
                </p>
              </div>
              <p className="text-green-700 text-sm">
                📧 라이선스 키가 이메일로 전송되었습니다!
              </p>
              {licenseStatus.message && (
                <p className="text-green-600 text-xs mt-1">
                  {licenseStatus.message}
                </p>
              )}
            </div>
          )}

          {!licenseStatus.isProcessing &&
            !licenseStatus.isIssued &&
            licenseStatus.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm mb-2">
                  ⚠️ {licenseStatus.error}
                </p>
                <button
                  onClick={resendLicense}
                  className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  라이선스 재발송
                </button>
              </div>
            )}

          {licenseStatus.isIssued && licenseStatus.licenseKey && (
            <div className="mt-2">
              <button
                onClick={resendLicense}
                disabled={licenseStatus.isProcessing}
                className="text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-1 rounded"
              >
                {licenseStatus.isProcessing
                  ? "재발송 중..."
                  : "라이선스 재발송"}
              </button>
            </div>
          )}

          {/* 처리 완료 후 일반 메시지 표시 */}
          {isProcessed &&
            !licenseStatus.isProcessing &&
            !licenseStatus.isIssued &&
            licenseStatus.message && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 text-sm">
                  ⚠️ {licenseStatus.message}
                </p>
                <p className="text-yellow-700 text-xs mt-1">
                  라이선스가 이메일로 발송되었는지 확인해주시고, 문제가 있으시면
                  고객지원에 문의해주세요.
                </p>
              </div>
            )}
        </div>

        {/* 결제 정보 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-800 mb-3">결제 정보</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">주문번호:</span>
              <span className="font-mono text-xs">{detail.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">결제금액:</span>
              <span className="font-semibold">
                {Number(detail.amount).toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">결제일시:</span>
              <span className="font-mono text-xs">
                {detail.approvedAt || successTime}
              </span>
            </div>
            {/* 플랜 정보 표시 */}
            {detail.accountCount && detail.postCount && detail.months && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">아이디 수:</span>
                  <span className="font-mono text-xs">
                    {detail.accountCount}개
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">글 수:</span>
                  <span className="font-mono text-xs">
                    {detail.postCount}개
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">사용 기간:</span>
                  <span className="font-mono text-xs">{detail.months}개월</span>
                </div>
              </>
            )}
            {/* 결제자 정보 표시 */}
            {detail.name && (
              <div className="flex justify-between">
                <span className="text-gray-600">결제자명:</span>
                <span className="font-mono text-xs">{detail.name}</span>
              </div>
            )}
            {detail.email && (
              <div className="flex justify-between">
                <span className="text-gray-600">이메일:</span>
                <span className="font-mono text-xs">{detail.email}</span>
              </div>
            )}
            {detail.phone && (
              <div className="flex justify-between">
                <span className="text-gray-600">전화번호:</span>
                <span className="font-mono text-xs">{detail.phone}</span>
              </div>
            )}
            {detail.method && (
              <div className="flex justify-between">
                <span className="text-gray-600">결제수단:</span>
                <span className="font-mono text-xs">
                  {detail.method}
                  {detail.cardCompany ? ` (${detail.cardCompany})` : ""}
                </span>
              </div>
            )}
            {detail.installmentPlanMonths && (
              <div className="flex justify-between">
                <span className="text-gray-600">할부개월:</span>
                <span className="font-mono text-xs">
                  {detail.installmentPlanMonths === 1
                    ? "일시불"
                    : `${detail.installmentPlanMonths}개월`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 버튼들 */}
        <div className="space-y-3">
          <button
            onClick={handleGoHome}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
          >
            홈으로 이동
          </button>

          <button
            onClick={handleGoPaymentInfo}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-md transition-colors"
          >
            결제 정보로 돌아가기
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          ※ 테스트 결제이므로 실제 결제는 발생하지 않았습니다.
        </div>
      </div>
    </div>
  );
}
