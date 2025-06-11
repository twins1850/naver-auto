import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

// Purchase 인터페이스 (동적 버전 기반)
export interface Purchase {
  id: number;
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  version: string; // 동적 버전 (예: 3.4, 5.2)
  account_count: number; // 아이디 수
  post_count: number; // 글 수
  months: number; // 사용 기간
  amount: number; // 결제 금액
  payment_status: string; // 결제 상태
  temporary_license?: string; // 임시 라이선스
  final_license?: string; // 최종 인증키
  hardware_id?: string; // 하드웨어 ID
  activation_date?: string; // 활성화 날짜
  status: "pending" | "activated" | "expired"; // 상태
  created_at: string; // 생성일
  expire_date: string; // 만료일
}

// 구매 생성 (결제 완료 시)
export async function createPurchase({
  order_id,
  customer_name,
  customer_email,
  customer_phone,
  version,
  account_count,
  post_count,
  months,
  amount,
  expire_date,
}: {
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  version: string;
  account_count: number;
  post_count: number;
  months: number;
  amount: number;
  expire_date: string;
}): Promise<Purchase> {
  const res = await axios.post(`${API_BASE}/purchases/`, {
    order_id,
    customer_name,
    customer_email,
    customer_phone,
    version,
    account_count,
    post_count,
    months,
    amount,
    payment_status: "completed",
    expire_date,
  });
  return res.data;
}

// 라이선스 활성화
export async function activateLicense({
  temporary_license,
  hardware_id,
}: {
  temporary_license: string;
  hardware_id: string;
}) {
  try {
    // 1. 기존 백엔드 라이센스 활성화
    const res = await axios.post(`${API_BASE}/purchases/activate`, {
      temporary_license,
      hardware_id,
    });

    // 2. 🆕 활성화 성공 시 Google Sheets 자동 업데이트
    if (res.data.success && res.data.order_id) {
      console.log("🚀 Google Sheets 자동 업데이트 시작...");

      try {
        // 랜딩페이지의 Google Sheets 업데이트 API 호출
        const sheetsResponse = await axios.post(
          "http://localhost:3000/api/update-license-activation",
          {
            orderId: res.data.order_id,
            licenseKey: temporary_license,
            hardwareId: hardware_id,
            활성화일시: new Date().toISOString(),
            상태: "active",
          },
          {
            timeout: 10000, // 10초 타임아웃
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (sheetsResponse.data.success) {
          console.log("✅ Google Sheets 자동 업데이트 완료!");

          // 응답에 Google Sheets 업데이트 정보 추가
          res.data.googleSheetsUpdated = true;
          res.data.message =
            res.data.message + " (Google Sheets 자동 업데이트 완료)";
        } else {
          console.warn(
            "⚠️ Google Sheets 업데이트 실패:",
            sheetsResponse.data.message
          );
          res.data.googleSheetsUpdated = false;
          res.data.warning =
            "라이센스는 활성화되었지만 Google Sheets 업데이트에 실패했습니다.";
        }
      } catch (sheetsError: any) {
        console.error("❌ Google Sheets 업데이트 중 오류:", sheetsError);
        res.data.googleSheetsUpdated = false;
        res.data.warning =
          "라이센스는 활성화되었지만 Google Sheets 업데이트에 실패했습니다.";
      }
    }

    return res.data;
  } catch (error: any) {
    console.error("❌ 라이센스 활성화 실패:", error);
    throw error;
  }
}

// 라이선스 검증
export async function validateLicense({
  license_key,
  hardware_id,
}: {
  license_key: string;
  hardware_id: string;
}) {
  const res = await axios.post(`${API_BASE}/purchases/validate`, {
    license_key,
    hardware_id,
  });
  return res.data;
}

// 구매 목록 조회
export async function getPurchases(): Promise<Purchase[]> {
  const res = await axios.get(`${API_BASE}/purchases/`);
  return res.data;
}

// 특정 구매 정보 조회
export async function getPurchase(id: number): Promise<Purchase> {
  const res = await axios.get(`${API_BASE}/purchases/${id}`);
  return res.data;
}

// 주문번호로 구매 정보 조회
export async function getPurchaseByOrderId(
  order_id: string
): Promise<Purchase> {
  const res = await axios.get(`${API_BASE}/purchases/order/${order_id}`);
  return res.data;
}

// 다운로드 정보 조회
export async function getDownloadInfo(order_id: string) {
  const res = await axios.get(
    `${API_BASE}/purchases/download-info/${order_id}`
  );
  return res.data;
}

// 실제 가격 정책 (랜딩페이지와 동일)
export const PRICING_CONFIG = {
  basePrice: 100000, // 기본료 10만원
  unitPrice: 10000, // 추가 단위당 1만원 (아이디 1개 × 글 1개)
  maxAccounts: 10, // 최대 아이디 수
  maxPosts: 20, // 최대 글 수
  availableMonths: [1, 3, 6, 12], // 사용 가능 기간
  discountRates: {
    1: 0, // 1개월: 할인 없음
    3: 10, // 3개월: 10% 할인
    6: 15, // 6개월: 15% 할인
    12: 20, // 12개월: 20% 할인
  } as Record<number, number>,
} as const;

// 가격 계산 함수 (할인 적용)
export function calculatePrice(
  accountCount: number,
  postCount: number,
  months: number = 1
): number {
  // 기본료 + (아이디 수 × 글 수 × 단위가격)
  const monthlyPrice =
    PRICING_CONFIG.basePrice +
    accountCount * postCount * PRICING_CONFIG.unitPrice;
  const totalBeforeDiscount = monthlyPrice * months;

  // 할인 적용
  const discountRate = PRICING_CONFIG.discountRates[months] || 0;
  const discountAmount = Math.floor(totalBeforeDiscount * (discountRate / 100));
  const finalPrice = totalBeforeDiscount - discountAmount;

  return finalPrice;
}

// 월별 금액 계산 함수 (할인 미적용)
export function calculateMonthlyPrice(
  accountCount: number,
  postCount: number
): number {
  return (
    PRICING_CONFIG.basePrice +
    accountCount * postCount * PRICING_CONFIG.unitPrice
  );
}

// 할인 정보 계산 함수
export function calculateDiscountInfo(
  accountCount: number,
  postCount: number,
  months: number
) {
  const monthlyPrice = calculateMonthlyPrice(accountCount, postCount);
  const totalBeforeDiscount = monthlyPrice * months;
  const discountRate = PRICING_CONFIG.discountRates[months] || 0;
  const discountAmount = Math.floor(totalBeforeDiscount * (discountRate / 100));
  const finalPrice = totalBeforeDiscount - discountAmount;

  return {
    monthlyPrice,
    totalBeforeDiscount,
    discountRate,
    discountAmount,
    finalPrice,
  };
}

// 버전 생성 함수
export function generateVersion(
  accountCount: number,
  postCount: number
): string {
  return `${accountCount}.${postCount}`;
}

// 기능 목록 (버전에 따라 동적으로 결정)
export function getFeaturesByVersion(
  accountCount: number,
  postCount: number
): string[] {
  const features = ["기본 포스팅"];

  if (accountCount >= 2 || postCount >= 2) {
    features.push("간단 예약");
  }

  if (accountCount >= 3 || postCount >= 3) {
    features.push("고급 예약", "자동 해시태그");
  }

  if (accountCount >= 5 || postCount >= 5) {
    features.push("AI 콘텐츠", "대량 업로드");
  }

  if (accountCount >= 8 || postCount >= 10) {
    features.push("프리미엄 분석", "고급 스케줄링");
  }

  return features;
}
