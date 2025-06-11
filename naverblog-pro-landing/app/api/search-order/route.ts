import { NextRequest, NextResponse } from "next/server";
import { GoogleSheetsService } from "@/lib/google-sheets";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { error: "주문번호가 필요합니다." },
        { status: 400 }
      );
    }

    console.log("주문번호 검색 요청:", orderId);
    const googleSheetsService = new GoogleSheetsService();

    const orderData = await googleSheetsService.findByOrderId(orderId);

    if (!orderData) {
      return NextResponse.json(
        {
          success: false,
          message: "해당 주문번호를 찾을 수 없습니다.",
          orderId: orderId,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "주문 정보를 찾았습니다.",
      data: orderData,
    });
  } catch (error) {
    console.error("주문번호 검색 중 오류 발생:", error);
    return NextResponse.json(
      {
        error: "주문 검색 중 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// POST 방식으로도 검색 가능
export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "주문번호가 필요합니다." },
        { status: 400 }
      );
    }

    console.log("주문번호 검색 요청:", orderId);
    const googleSheetsService = new GoogleSheetsService();

    const orderData = await googleSheetsService.findByOrderId(orderId);

    if (!orderData) {
      return NextResponse.json(
        {
          success: false,
          message: "해당 주문번호를 찾을 수 없습니다.",
          orderId: orderId,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "주문 정보를 찾았습니다.",
      data: orderData,
    });
  } catch (error) {
    console.error("주문번호 검색 중 오류 발생:", error);
    return NextResponse.json(
      {
        error: "주문 검색 중 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
