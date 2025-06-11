"use client";
import { useEffect, useState } from "react";

interface LicenseInfo {
  라이선스키: string;
  고객명: string;
  이메일: string;
  연락처: string;
  상품유형: string;
  발급일시: string;
  만료일시: string;
  상태: string;
  결제ID: string;
  주문번호: string;
}

export default function LicenseAdminPage() {
  const [licenses, setLicenses] = useState<LicenseInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [resendEmail, setResendEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 라이선스 데이터 조회
  const fetchLicenses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/licenses");
      if (response.ok) {
        const data = await response.json();
        // 헤더 제외하고 데이터 설정
        const licenseData = data.slice(1).map((row: string[]) => ({
          라이선스키: row[0] || "",
          고객명: row[1] || "",
          이메일: row[2] || "",
          연락처: row[3] || "",
          상품유형: row[4] || "",
          발급일시: row[5] || "",
          만료일시: row[6] || "",
          상태: row[7] || "",
          결제ID: row[8] || "",
          주문번호: row[9] || "",
        }));
        setLicenses(licenseData);
      } else {
        console.error("라이선스 데이터 조회 실패");
      }
    } catch (error) {
      console.error("라이선스 데이터 조회 중 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  // 라이선스 재발송
  const handleResendLicense = async () => {
    if (!resendEmail.trim()) {
      setMessage("이메일을 입력해주세요.");
      return;
    }

    try {
      setResendLoading(true);
      setMessage("");

      const response = await fetch("/api/issue-license", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: resendEmail }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage(`✅ ${resendEmail}로 라이선스가 재발송되었습니다.`);
        setResendEmail("");
      } else {
        setMessage(`❌ ${result.error || "라이선스 재발송에 실패했습니다."}`);
      }
    } catch (error) {
      console.error("라이선스 재발송 중 오류:", error);
      setMessage("❌ 라이선스 재발송 중 오류가 발생했습니다.");
    } finally {
      setResendLoading(false);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">라이선스 관리</h1>
            <button
              onClick={fetchLicenses}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md"
            >
              {loading ? "새로고침 중..." : "새로고침"}
            </button>
          </div>

          {/* 라이선스 재발송 섹션 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">
              라이선스 재발송
            </h3>
            <div className="flex gap-2">
              <input
                type="email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                placeholder="재발송할 이메일 주소"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleResendLicense}
                disabled={resendLoading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md"
              >
                {resendLoading ? "발송 중..." : "재발송"}
              </button>
            </div>
            {message && (
              <p
                className={`mt-2 text-sm ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}
              >
                {message}
              </p>
            )}
          </div>

          {/* 라이선스 목록 */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">데이터를 불러오는 중...</p>
              </div>
            ) : licenses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">발급된 라이선스가 없습니다.</p>
              </div>
            ) : (
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                      라이선스키
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                      고객명
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                      이메일
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                      연락처
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                      상품유형
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                      발급일시
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                      만료일시
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                      상태
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                      주문번호
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {licenses.map((license, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2 text-xs font-mono">
                        {license.라이선스키}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">
                        {license.고객명}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">
                        {license.이메일}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">
                        {license.연락처}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            license.상품유형 === "스탠다드"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {license.상품유형}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-xs">
                        {license.발급일시}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-xs">
                        {license.만료일시}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            license.상태 === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {license.상태}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-xs font-mono">
                        {license.주문번호}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="mt-6 text-sm text-gray-600">
            <p>총 {licenses.length}개의 라이선스가 발급되었습니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
