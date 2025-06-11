"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  CheckCircle,
  Info,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

// 메타데이터는 클라이언트 컴포넌트에서 제거
// export const metadata: Metadata = {...}

interface PricingPlan {
  name: string;
  basePrice: number;
  accountIds: number;
  postsPerAccount: number;
  totalPosts: number;
}

const PRESET_PLANS: PricingPlan[] = [
  {
    name: "베이직",
    basePrice: 110000,
    accountIds: 1,
    postsPerAccount: 1,
    totalPosts: 1,
  },
];

const DISCOUNT_RATES = [
  { months: 1, rate: 0, label: "1개월 (할인 없음)" },
  { months: 3, rate: 10, label: "3개월 (10% 할인)" },
  { months: 6, rate: 15, label: "6개월 (15% 할인)" },
  { months: 12, rate: 20, label: "12개월 (20% 할인)" },
];

export default function PaymentInfoPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [customIds, setCustomIds] = useState<number>(1);
  const [customPosts, setCustomPosts] = useState<number>(1);
  const [paymentMonths, setPaymentMonths] = useState<number>(1);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const emailInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  // 가격 계산 로직
  const calculatePrice = () => {
    const basePrice = 110000; // 기본 플랜 가격

    let accountIds = customIds;
    let postsPerAccount = customPosts;

    // 미리 설정된 플랜 선택시(베이직)
    if (!isCustom && selectedPlan) {
      const plan = PRESET_PLANS.find((p) => p.name === selectedPlan);
      if (plan) {
        accountIds = plan.accountIds;
        postsPerAccount = plan.postsPerAccount;
      }
    }

    // 커스텀: 110,000 + (아이디 수 × 글 수 × 10,000)
    const optionPrice = accountIds * postsPerAccount * 10000;
    const monthlyPrice = basePrice + (isCustom ? optionPrice : 0);
    const totalBeforeDiscount = monthlyPrice * paymentMonths;

    // 할인 적용
    const discountRate =
      DISCOUNT_RATES.find((d) => d.months === paymentMonths)?.rate || 0;
    const discountAmount = Math.floor(
      totalBeforeDiscount * (discountRate / 100)
    );
    const finalPrice = totalBeforeDiscount - discountAmount;

    return {
      monthlyPrice,
      totalBeforeDiscount,
      discountRate,
      discountAmount,
      finalPrice,
      accountIds,
      postsPerAccount,
      totalPostsPerDay: accountIds * postsPerAccount,
    };
  };

  const priceInfo = calculatePrice();

  // 상품명 생성 함수
  const generateProductName = () => {
    const { accountIds, postsPerAccount } = priceInfo;
    const monthsText = paymentMonths === 1 ? "" : ` ${paymentMonths}개월`;
    return `blog-pro ${accountIds}.${postsPerAccount}${monthsText}`;
  };

  // 이메일, 이름, 전화번호 검증 함수
  const validateEmail = (value: string) =>
    /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(value);
  const validatePhone = (value: string) =>
    /^01[016789][0-9]{7,8}$/.test(value.replace(/-/g, ""));

  // 결제 버튼 활성화 조건
  const isFormValid =
    validateEmail(email) && name.trim().length > 0 && validatePhone(phone);

  // 결제 버튼 클릭 시
  const handlePayment = () => {
    let valid = true;
    if (!validateEmail(email)) {
      setEmailError("이메일은 필수 입력이며, 이메일 형식이어야 합니다.");
      emailInputRef.current?.focus();
      valid = false;
    } else {
      setEmailError("");
    }
    if (name.trim().length === 0) {
      setNameError("이름은 필수 입력입니다.");
      if (valid) nameInputRef.current?.focus();
      valid = false;
    } else {
      setNameError("");
    }
    if (!validatePhone(phone)) {
      setPhoneError("전화번호는 숫자만 입력(01012345678) 형식이어야 합니다.");
      if (valid) phoneInputRef.current?.focus();
      valid = false;
    } else {
      setPhoneError("");
    }
    if (!valid) return;
    // 기존 결제 로직 + 결제자 정보 추가
    const productName = generateProductName();
    const amount = priceInfo.finalPrice;
    const params = new URLSearchParams({
      productName,
      amount: amount.toString(),
      accountIds: priceInfo.accountIds.toString(),
      postsPerAccount: priceInfo.postsPerAccount.toString(),
      months: paymentMonths.toString(),
      discountRate: priceInfo.discountRate.toString(),
      email,
      name,
      phone,
    });
    window.location.href = `/payment-info/toss?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            NaverBlog Pro 가격 계산기
          </h1>
          <p className="text-xl text-gray-600">
            필요한 아이디 수와 글 발행량에 맞춰 정확한 가격을 확인하세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽: 가격 정책 설명 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="h-5 w-5" />
                  <span>가격 정책 안내</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    📊 최소 선택 기준
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• 최소: 아이디 1개, 글 1개, 1개월 = 110,000원</li>
                    <li>
                      • 커스텀: 110,000원 + (아이디 수 × 글 수 × 10,000원)
                    </li>
                    <li className="text-sm text-gray-500">
                      예) 아이디 3개 × 글 3개 = 9만원 추가 → 월 19만원
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    💰 장기 결제 할인
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-600">1개월: 할인 없음</span>
                    <span className="text-gray-600">3개월: 10% 할인</span>
                    <span className="text-gray-600">6개월: 15% 할인</span>
                    <span className="text-gray-600">12개월: 20% 할인</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">
                    🎯 미리 설정된 플랜
                  </h3>
                  <div className="space-y-2">
                    {PRESET_PLANS.map((plan) => (
                      <div
                        key={plan.name}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {plan.name}: 아이디 {plan.accountIds}개 × 글{" "}
                          {plan.postsPerAccount}개
                        </span>
                        <span className="font-semibold">
                          ₩{plan.basePrice.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 오른쪽: 계산기 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5" />
                  <span>가격 계산기</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 플랜 선택 안내문구만 표시 */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    1. 플랜 선택
                  </Label>
                  <div className="mb-4 text-sm text-gray-600">
                    최소: 아이디 1개, 글 1개, 1개월 = 110,000원
                  </div>
                  <Button
                    variant={isCustom ? "default" : "outline"}
                    onClick={() => {
                      setIsCustom(true);
                      setSelectedPlan("");
                    }}
                    className="w-full"
                  >
                    사용할 플랜 선택
                  </Button>
                </div>

                {/* 커스텀 설정 */}
                {isCustom && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="customIds">아이디 개수</Label>
                      <Input
                        id="customIds"
                        type="number"
                        min="1"
                        max="20"
                        value={customIds}
                        onChange={(e) => setCustomIds(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customPosts">
                        아이디당 일일 글 발행 수
                      </Label>
                      <Input
                        id="customPosts"
                        type="number"
                        min="1"
                        max="10"
                        value={customPosts}
                        onChange={(e) => setCustomPosts(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                {/* 결제 기간 선택 */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    2. 결제 기간
                  </Label>
                  <Select
                    value={paymentMonths.toString()}
                    onValueChange={(value) => setPaymentMonths(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DISCOUNT_RATES.map((discount) => (
                        <SelectItem
                          key={discount.months}
                          value={discount.months.toString()}
                        >
                          {discount.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 이메일 입력란 */}
                <div>
                  <Label
                    htmlFor="email"
                    className="text-base font-semibold mb-1 block"
                  >
                    3. 인증키 받을 이메일 주소{" "}
                    <span className="text-red-600">(필수)</span>
                  </Label>
                  <Input
                    id="email"
                    ref={emailInputRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`mt-1 ${emailError ? "border-red-500 focus:ring-red-500" : ""}`}
                    placeholder="example@email.com"
                  />
                  {emailError && (
                    <div className="text-red-600 text-sm mt-1">
                      {emailError}
                    </div>
                  )}
                </div>

                {/* 결제자 정보 입력란 */}
                <div>
                  <Label className="text-base font-semibold mb-1 block">
                    4. 결제자 정보 <span className="text-red-600">(필수)</span>
                  </Label>
                  <div className="space-y-2">
                    <Input
                      id="name"
                      ref={nameInputRef}
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={
                        nameError ? "border-red-500 focus:ring-red-500" : ""
                      }
                      placeholder="이름"
                    />
                    {nameError && (
                      <div className="text-red-600 text-sm mt-1">
                        {nameError}
                      </div>
                    )}
                    <Input
                      id="phone"
                      ref={phoneInputRef}
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={
                        phoneError ? "border-red-500 focus:ring-red-500" : ""
                      }
                      placeholder="전화번호 (01012345678)"
                    />
                    {phoneError && (
                      <div className="text-red-600 text-sm mt-1">
                        {phoneError}
                      </div>
                    )}
                  </div>
                </div>

                {/* 가격 계산 결과 */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3">
                    💰 가격 계산 결과
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>아이디 수:</span>
                      <span className="font-semibold">
                        {priceInfo.accountIds}개
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>아이디당 글 수:</span>
                      <span className="font-semibold">
                        {priceInfo.postsPerAccount}개
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>총 일일 글 발행:</span>
                      <span className="font-semibold text-blue-600">
                        {priceInfo.totalPostsPerDay}개
                      </span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between">
                      <span>월 이용료:</span>
                      <span>₩{priceInfo.monthlyPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{paymentMonths}개월 총액:</span>
                      <span>
                        ₩{priceInfo.totalBeforeDiscount.toLocaleString()}
                      </span>
                    </div>
                    {priceInfo.discountRate > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>할인 ({priceInfo.discountRate}%):</span>
                        <span>
                          -₩{priceInfo.discountAmount.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <hr className="my-2" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>최종 결제금액:</span>
                      <span className="text-green-600">
                        ₩{priceInfo.finalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 상품명 미리보기 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-sm text-gray-600 mb-1">결제 상품명:</div>
                  <Badge variant="outline" className="text-sm">
                    {generateProductName()}
                  </Badge>
                </div>

                {/* 결제 버튼 */}
                <Button
                  onClick={handlePayment}
                  className="w-full bg-green-600 hover:bg-green-700 text-lg py-3"
                  size="lg"
                  disabled={!isFormValid}
                >
                  토스(Toss)로 결제하기
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 하단 안내 */}
        <div className="mt-12 text-center">
          <Card className="bg-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-semibold">안전한 결제 시스템</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                결제는 토스(Toss) 안전결제 시스템을 통해 진행됩니다.
                <br />
                결제 완료 후 라이선스가 자동 발급되며, 이메일로 안내가
                발송됩니다.
              </p>
              <p className="text-gray-600 text-sm">
                <span className="font-bold">
                  결제 관련 문의: support@naverblogpro.com
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 뒤로가기 */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-green-600 hover:underline"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
