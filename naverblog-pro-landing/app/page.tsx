"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircle,
  Clock,
  Users,
  Zap,
  TrendingUp,
  Shield,
  Star,
  ArrowRight,
  Bot,
  Calendar,
} from "lucide-react";

export default function LandingPage() {
  const handleScroll = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const headerHeight = 80; // 헤더 높이 고려
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">
                NaverBlog Pro
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => handleScroll("features")}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                기능
              </button>
              <button
                onClick={() => handleScroll("tech-comparison")}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                기술 비교
              </button>
              <button
                onClick={() => handleScroll("pricing")}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                가격
              </button>
              <button
                onClick={() => handleScroll("demo")}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                데모
              </button>
              <button
                onClick={() => handleScroll("faq")}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                FAQ
              </button>
              <button
                onClick={() => handleScroll("refund")}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                환불정책
              </button>
            </nav>
            <Button className="bg-green-600 hover:bg-green-700" asChild>
              <a href="/payment-info">구매하기</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
              개인 블로거를 위한 업무 효율화 도구
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              스마트 블로그 관리 솔루션
              <span className="text-green-600 block">NaverBlog Pro</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              개인 블로거를 위한 콘텐츠 제작 도구로 일일 블로그 관리 업무를 90%
              단축하세요. AI를 활용한 스마트한 글 작성으로 더 많은 시간을 창작
              활동에 집중할 수 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4"
                asChild
              >
                <a href="/payment-info">
                  지금 시작하기
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4"
                onClick={() => handleScroll("demo")}
              >
                사용법 보기
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600">90%</div>
                <div className="text-gray-600">업무시간 단축</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">AI</div>
                <div className="text-gray-600">스마트 글 작성</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">개인</div>
                <div className="text-gray-600">맞춤형 솔루션</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem-Solution Section */}
      <section id="problem-solution" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              개인 블로거의 고민을 해결합니다
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    매일 반복되는 글 작성 업무
                  </h3>
                  <p className="text-gray-600">
                    하루 6-8시간씩 블로그 글 작성과 관리에 시간을 쏟아야 하는
                    부담
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    여러 블로그 계정 관리의 어려움
                  </h3>
                  <p className="text-gray-600">
                    개인이 운영하는 여러 블로그를 일일이 관리하는 번거로움
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    일관된 품질의 콘텐츠 제작
                  </h3>
                  <p className="text-gray-600">
                    매번 동일한 수준의 양질의 콘텐츠를 지속적으로 만들어내는
                    어려움
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                NaverBlog Pro 솔루션
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">
                    AI 활용으로 30분 내 완료
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">
                    다중 계정 원클릭 자동 관리
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">네이버 SEO 자동 최적화</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">
                    스마트에디터 형식 자동 적용
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Comparison Section */}
      <section id="tech-comparison" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              기존 API 방식 vs 커스텀 GPT 방식
            </h2>
            <p className="text-xl text-gray-600">
              왜 커스텀 GPT 방식이 더 나을까요?
            </p>
          </div>

          {/* 방식별 장단점 비교 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* API 자동화 방식 */}
            <Card className="border-2 border-red-200 bg-red-50">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-2xl text-red-700">
                  기존 API 자동화
                </CardTitle>
                <CardDescription className="text-red-600">
                  단순 반복 작업에 특화된 구식 방법
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-sm">✗</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      획일적인 콘텐츠
                    </h4>
                    <p className="text-gray-600 text-sm">
                      템플릿 기반으로 비슷한 글만 반복 생성
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-sm">✗</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      개성 부족
                    </h4>
                    <p className="text-gray-600 text-sm">
                      블로그별 고유한 톤앤매너 반영 어려움
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-sm">✗</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      복잡한 설정
                    </h4>
                    <p className="text-gray-600 text-sm">
                      API 키 발급, 복잡한 연동 과정 필요
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-sm">✗</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      높은 비용
                    </h4>
                    <p className="text-gray-600 text-sm">
                      API 호출 비용 + 프로그램 비용 이중 부담
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-sm">✗</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      제한적 커스터마이징
                    </h4>
                    <p className="text-gray-600 text-sm">
                      미리 정해진 형식에서 벗어나기 어려움
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 커스텀 GPT 방식 */}
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-700">
                  커스텀 GPT 방식
                </CardTitle>
                <CardDescription className="text-green-600">
                  개성있는 콘텐츠 생성의 혁신적 방법
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      개성있는 콘텐츠
                    </h4>
                    <p className="text-gray-600 text-sm">
                      블로그별 맞춤형 GPT로 고유한 스타일 유지
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      주제별 전문화
                    </h4>
                    <p className="text-gray-600 text-sm">
                      요리, 여행, 리뷰 등 분야별 특화된 GPT 활용
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      간편한 설정
                    </h4>
                    <p className="text-gray-600 text-sm">
                      브라우저 창만으로 간단한 연동 완료
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      경제적인 비용
                    </h4>
                    <p className="text-gray-600 text-sm">
                      별도 API 비용 없이 프로그램 비용만 지불
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      무제한 커스터마이징
                    </h4>
                    <p className="text-gray-600 text-sm">
                      원하는 스타일로 자유롭게 GPT 학습 가능
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 상세 비교표 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-4 text-left font-semibold text-gray-900 border-b">
                      비교 항목
                    </th>
                    <th className="p-4 text-center font-semibold text-red-600 border-b">
                      기존 API 방식
                    </th>
                    <th className="p-4 text-center font-semibold text-green-600 border-b">
                      커스텀 GPT 방식
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium">콘텐츠 개성</td>
                    <td className="p-4 text-center text-red-600">획일적</td>
                    <td className="p-4 text-center text-green-600">
                      개성 보장
                    </td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4 font-medium">설정 난이도</td>
                    <td className="p-4 text-center text-red-600">복잡함</td>
                    <td className="p-4 text-center text-green-600">
                      매우 간단
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">추가 비용</td>
                    <td className="p-4 text-center text-red-600">
                      API 사용료 별도
                    </td>
                    <td className="p-4 text-center text-green-600">
                      추가 비용 없음
                    </td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4 font-medium">주제별 특화</td>
                    <td className="p-4 text-center text-red-600">제한적</td>
                    <td className="p-4 text-center text-green-600">
                      완벽 지원
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">학습 가능성</td>
                    <td className="p-4 text-center text-red-600">
                      고정된 모델
                    </td>
                    <td className="p-4 text-center text-green-600">
                      지속적 학습
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-4 font-medium">사용자 경험</td>
                    <td className="p-4 text-center text-red-600">기계적</td>
                    <td className="p-4 text-center text-green-600">
                      자연스러움
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 실제 사용 예시 */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-red-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-red-700 mb-4">
                API 방식 예시
              </h3>
              <div className="bg-white p-4 rounded border-l-4 border-red-500">
                <p className="text-gray-700 text-sm mb-2">생성된 글 제목:</p>
                <p className="font-medium mb-3">
                  "오늘의 맛집 추천 - 이탈리안 레스토랑"
                </p>
                <p className="text-gray-600 text-sm">
                  → 템플릿 기반의 뻔한 제목
                  <br />
                  → 모든 블로그에서 비슷한 패턴
                  <br />→ 개성 없는 획일적 콘텐츠
                </p>
              </div>
            </div>

            <div className="bg-green-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-green-700 mb-4">
                커스텀 GPT 방식 예시
              </h3>
              <div className="bg-white p-4 rounded border-l-4 border-green-500">
                <p className="text-gray-700 text-sm mb-2">생성된 글 제목:</p>
                <p className="font-medium mb-3">
                  "엄마표 파스타가 생각나는 홍대 숨은 맛집 발견!"
                </p>
                <p className="text-gray-600 text-sm">
                  → 개인적 경험이 담긴 제목
                  <br />
                  → 블로거 고유 스타일 반영
                  <br />→ 감정이 담긴 자연스러운 표현
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              개인 블로거를 위한 핵심 기능
            </h2>
            <p className="text-xl text-gray-600">
              일상적인 블로그 관리 업무를 효율적으로 처리하는 도구
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Bot className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>AI 콘텐츠 제작 도구</CardTitle>
                <CardDescription>
                  개인 블로거의 글쓰기 스타일을 학습한 AI가 자연스러운 콘텐츠
                  생성
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Zap className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>업무 효율화 솔루션</CardTitle>
                <CardDescription>
                  반복적인 글 작성 업무를 자동화하여 창작 시간 확보
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>다중 블로그 관리</CardTitle>
                <CardDescription>
                  개인이 운영하는 여러 블로그를 통합 관리
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Calendar className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>스케줄 관리 기능</CardTitle>
                <CardDescription>
                  블로그별 발행 일정을 체계적으로 관리
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>품질 최적화</CardTitle>
                <CardDescription>
                  블로그 플랫폼에 최적화된 글 형식으로 자동 변환
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>지속적인 업데이트</CardTitle>
                <CardDescription>
                  플랫폼 변경사항에 맞춘 프로그램 자동 업데이트
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              수동 관리 vs NaverBlog Pro
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left font-semibold text-gray-900">
                    구분
                  </th>
                  <th className="p-4 text-center font-semibold text-red-600">
                    수동 관리
                  </th>
                  <th className="p-4 text-center font-semibold text-green-600">
                    NaverBlog Pro
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-4 font-medium">작업 시간</td>
                  <td className="p-4 text-center text-red-600">일 6-8시간</td>
                  <td className="p-4 text-center text-green-600">일 30분</td>
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="p-4 font-medium">글 품질</td>
                  <td className="p-4 text-center text-red-600">
                    개인 편차 존재
                  </td>
                  <td className="p-4 text-center text-green-600">
                    일관된 품질 유지
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="p-4 font-medium">다중 계정 관리</td>
                  <td className="p-4 text-center text-red-600">
                    개별 로그인 필요
                  </td>
                  <td className="p-4 text-center text-green-600">통합 관리</td>
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="p-4 font-medium">업무 부담</td>
                  <td className="p-4 text-center text-red-600">
                    높은 스트레스
                  </td>
                  <td className="p-4 text-center text-green-600">
                    창작에 집중
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              투명한 가격 정책
            </h2>
            <p className="text-xl text-gray-600">필요한 만큼만 선택하세요</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 베이직 플랜 */}
            <Card className="border-2 border-gray-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">베이직 플랜</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mt-4">
                  ₩100,000
                  <span className="text-lg font-normal text-gray-600">/월</span>
                </div>
                <p className="text-sm text-gray-600">
                  계정 1개 × 글 1개 = 총 1개/일
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>모든 기본 기능 포함</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>AI 콘텐츠 생성</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>자동 업데이트</span>
                </div>
                <Button className="w-full mt-6" asChild>
                  <a href="/payment-info">시작하기</a>
                </Button>
              </CardContent>
            </Card>

            {/* 커스텀 플랜 */}
            <Card className="border-2 border-blue-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white">맞춤형</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">커스텀 플랜</CardTitle>
                <div className="text-3xl font-bold text-gray-900 mt-4">
                  원하는 대로
                  <span className="text-lg font-normal text-gray-600 block">
                    /월
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  10만원 + (계정 수 × 글 수 × 1만원)
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span>계정/글 수 자유 설정</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span>모든 기능 포함</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span>우선 기술지원</span>
                </div>
                <div className="text-xs text-gray-500">
                  예) 계정 3개 × 글 3개 = 9만원 추가 → 월 19만원
                </div>
                <Button
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                  asChild
                >
                  <a href="/payment-info">가격 계산하기</a>
                </Button>
              </CardContent>
            </Card>

            {/* 엔터프라이즈 플랜 */}
            <Card className="border-2 border-purple-500">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">엔터프라이즈</CardTitle>
                <div className="text-3xl font-bold text-gray-900 mt-4">
                  맞춤 견적
                  <span className="text-lg font-normal text-gray-600 block">
                    /월
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  대용량 처리를 위한 특화 솔루션
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  <span>무제한 계정 관리</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  <span>전용 고객지원</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  <span>커스텀 개발</span>
                </div>
                <Button
                  className="w-full mt-6 bg-purple-600 hover:bg-purple-700"
                  asChild
                >
                  <a href="mailto:support@naverblogpro.com">문의하기</a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 가격 정책 설명 */}
          <div className="mt-12 text-center">
            <div className="bg-white rounded-lg p-8 max-w-4xl mx-auto shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                가격 정책 안내
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    📊 요금제 구성
                  </h4>
                  <div className="text-left space-y-2">
                    <p className="text-gray-600">• 베이직 플랜: ₩100,000/월</p>
                    <p className="text-gray-600">
                      • 커스텀: 10만원 + (계정 수 × 글 수 × 1만원)
                    </p>
                    <p className="text-sm text-gray-500">
                      예) 계정 3개 × 글 3개 = 9만원 추가 → 월 19만원
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    💰 결제 방식
                  </h4>
                  <div className="text-left space-y-2">
                    <p className="text-gray-600">• 월별 정기 결제</p>
                    <p className="text-gray-600">• 안전한 PG 결제</p>
                    <p className="text-gray-600">• 투명한 과금 체계</p>
                    <p className="text-gray-600">• 언제든 플랜 변경 가능</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              간단한 사용법
            </h2>
            <p className="text-xl text-gray-600">
              3단계로 완성되는 블로그 관리 솔루션
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI 도구 설정</h3>
              <p className="text-gray-600">
                개인 맞춤형 AI 모델을 프로그램에 연결합니다
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">블로그 계정 설정</h3>
              <p className="text-gray-600">
                관리할 블로그 계정과 발행 일정을 설정합니다
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">자동 실행</h3>
              <p className="text-gray-600">
                설정된 일정에 따라 자동으로 콘텐츠가 생성됩니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Policy Section */}
      <section id="refund" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              환불 정책
            </h2>
            <p className="text-xl text-gray-600">
              명확하고 투명한 환불 규정을 안내드립니다
            </p>
          </div>
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    프로그램 업데이트 보장
                  </h3>
                  <p className="text-gray-600">
                    모든 프로그램은 플랫폼 변경사항에 대응하여 지속적으로
                    업데이트됩니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    미작동시 100% 환불
                  </h3>
                  <p className="text-gray-600">
                    프로그램 미작동시 환불은 100% 가능합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-red-600 text-sm font-bold">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    변심 환불 불가
                  </h3>
                  <p className="text-gray-600">
                    다만 변심에 의한 환불은 불가하오니 이점 양지해 주시기
                    바랍니다.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">법적 근거</h4>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>
                    <a
                      href="http://law.go.kr/법령/전자상거래등에서의소비자보호에관한법률/제17조"
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      전자상거래등에서의소비자보호에관한법률 제17조
                    </a>
                  </p>
                  <p className="text-gray-600">
                    작업이 완료된 이후 또는 자료, 프로그램 등 서비스가 제공된
                    이후에는 환불이 불가합니다. (소비자보호법 17조 2항의 5조.
                    용역 또는 「문화산업진흥 기본법」 제2조 제5호의
                    디지털콘텐츠의 제공이 개시된 경우에 해당)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              사용자 후기
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "하루 8시간씩 블로그 글 쓰던 시간이 30분으로 줄었어요. 더 많은
                  시간을 다른 창작 활동에 투자할 수 있게 되었습니다!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-semibold">김</span>
                  </div>
                  <div>
                    <div className="font-semibold">김○○</div>
                    <div className="text-sm text-gray-600">개인 블로거</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "여러 블로그를 동시에 관리하면서도 각각의 개성을 유지할 수
                  있어서 정말 만족합니다."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold">박</span>
                  </div>
                  <div>
                    <div className="font-semibold">박○○</div>
                    <div className="text-sm text-gray-600">
                      콘텐츠 크리에이터
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "AI 도구 덕분에 일관된 품질의 글을 지속적으로 작성할 수 있어서
                  블로그 운영이 훨씬 수월해졌어요."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-orange-600 font-semibold">이</span>
                  </div>
                  <div>
                    <div className="font-semibold">이○○</div>
                    <div className="text-sm text-gray-600">취미 블로거</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              자주 묻는 질문
            </h2>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                AI 콘텐츠 도구는 어떻게 연동하나요?
              </AccordionTrigger>
              <AccordionContent>
                본인이 사용하시는 커스텀 GPT 창을 통해 연동됩니다. 아이디별로
                여러 개의 주제에 특화된 커스텀 GPT를 설정하여 각각 다른 용도로
                활용할 수 있습니다. 예를 들어 요리 블로그용, 여행 블로그용, 리뷰
                블로그용 등 각 주제에 맞는 전문화된 GPT로 더욱 정확하고 개성있는
                콘텐츠를 생성할 수 있습니다.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                블로그 플랫폼에서 프로그램 차단 위험은 없나요?
              </AccordionTrigger>
              <AccordionContent>
                일반 사용자와 동일한 방식으로 동작하며, 과도한 요청을 방지하는
                안전장치가 내장되어 있습니다. 또한 플랫폼 정책 변경 시 즉시
                업데이트됩니다.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                환불 정책은 어떻게 되나요?
              </AccordionTrigger>
              <AccordionContent>
                프로그램 미작동시 100% 환불이 가능합니다. 다만 변심에 의한
                환불은 전자상거래법에 따라 불가합니다. 자세한 내용은 환불정책
                섹션을 참고해주세요.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                계정이나 글 개수는 언제든 변경 가능한가요?
              </AccordionTrigger>
              <AccordionContent>
                네, 언제든 플랜 변경이 가능합니다. 추가 옵션은 즉시 적용되며,
                일할 계산으로 요금이 조정됩니다.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                개인 블로거도 사용할 수 있나요?
              </AccordionTrigger>
              <AccordionContent>
                네, 개인 블로거를 위해 특별히 설계된 솔루션입니다. 베이직
                플랜부터 시작해서 필요에 따라 확장할 수 있으며, 직관적인
                인터페이스로 누구나 쉽게 사용할 수 있습니다.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section
        id="cta"
        className="py-20 bg-gradient-to-br from-green-600 to-blue-600 text-white"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            지금 시작하고 블로그 관리 업무를 혁신하세요
          </h2>
          <p className="text-xl mb-8 opacity-90">
            하루 6시간을 30분으로 단축하는 스마트한 솔루션을 경험해보세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-4"
              asChild
            >
              <a href="/payment-info">
                구매하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-green-600 text-lg px-8 py-4"
              asChild
            >
              <a href="mailto:support@naverblogpro.com">상담 신청하기</a>
            </Button>
          </div>
          <p className="text-sm mt-6 opacity-75">
            안전한 PG 결제 시스템 • 투명한 환불 정책
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bot className="h-8 w-8 text-green-400" />
                <span className="text-xl font-bold">NaverBlog Pro</span>
              </div>
              <p className="text-gray-400">
                개인 블로거를 위한 스마트 블로그 관리 솔루션
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">제품</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button
                    onClick={() => handleScroll("features")}
                    className="hover:text-white transition-colors"
                  >
                    기능
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleScroll("tech-comparison")}
                    className="hover:text-white transition-colors"
                  >
                    기술 비교
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleScroll("pricing")}
                    className="hover:text-white transition-colors"
                  >
                    가격
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleScroll("demo")}
                    className="hover:text-white transition-colors"
                  >
                    사용법
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">지원</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button
                    onClick={() => handleScroll("faq")}
                    className="hover:text-white transition-colors"
                  >
                    FAQ
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleScroll("testimonials")}
                    className="hover:text-white transition-colors"
                  >
                    사용자 후기
                  </button>
                </li>
                <li>
                  <a
                    href="mailto:support@naverblogpro.com"
                    className="hover:text-white transition-colors"
                  >
                    고객지원
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">정책</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button
                    onClick={() => handleScroll("refund")}
                    className="hover:text-white transition-colors"
                  >
                    환불정책
                  </button>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    이용약관
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    개인정보처리방침
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 NaverBlog Pro. All rights reserved.</p>
            <p className="mt-2">
              대표자명 : 김형원&nbsp;&nbsp;|&nbsp;&nbsp;상호명 : 뉴잉글리쉬
              원어민영어
            </p>
            <p className="mt-2 text-sm">
              개인 블로거를 위한 업무 효율화 도구 • 안전한 결제 시스템 • 투명한
              환불 정책
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
