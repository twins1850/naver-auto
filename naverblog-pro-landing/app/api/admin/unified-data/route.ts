import { NextRequest, NextResponse } from "next/server";
import { GoogleSheetsService } from "../../../../lib/google-sheets";

export async function GET(request: NextRequest) {
  try {
    const sheetsService = new GoogleSheetsService();

    // Google Sheets에서 통합 데이터 조회
    const allData = await sheetsService.getAllData();

    if (!allData || allData.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "데이터가 없습니다.",
          data: [],
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    }

    // 헤더와 데이터 분리
    const headerRow = allData[0];
    const dataRows = allData.slice(1);

    // 객체 형태로 변환
    const unifiedData = dataRows.map((row, index) => {
      const rowData: any = { id: index + 1 };
      headerRow.forEach((header, colIndex) => {
        rowData[header] = row[colIndex] || "";
      });
      return rowData;
    });

    return NextResponse.json(
      {
        success: true,
        message: "통합 데이터 조회 성공",
        data: unifiedData,
        total: unifiedData.length,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    console.error("통합 데이터 조회 중 오류:", error);

    return NextResponse.json(
      {
        success: false,
        message: "통합 데이터 조회 중 오류가 발생했습니다.",
        error: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
