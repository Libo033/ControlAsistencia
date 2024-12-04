import clientPromise from "@/libs/mongodb/mongodb";
import { Db, Document, MongoClient, WithId } from "mongodb";
import { NextRequest } from "next/server";
import * as XLSX from "xlsx";

export async function GET(req: NextRequest) {
  try {
    const searchParams: URLSearchParams = req.nextUrl.searchParams;
    const year: string | null = searchParams.get("year");
    const month: string | null = searchParams.get("month");
    const day: string | null = searchParams.get("day");

    const client: MongoClient = await clientPromise;
    const db: Db = client.db("assist_control");

    let assist: WithId<Document>[] = await db
      .collection("assist")
      .find()
      .toArray();

    assist.sort((a, b) => a.created_at - b.created_at);

    if (year || month || day) {
      year
        ? (assist = assist.filter(
            (as) => new Date(as.created_at).getFullYear() === parseInt(year)
          ))
        : undefined;
      month
        ? (assist = assist.filter(
            (as) => new Date(as.created_at).getMonth() === parseInt(month) - 1
          ))
        : undefined;
      day
        ? (assist = assist.filter(
            (as) => new Date(as.created_at).getDate() === parseInt(day)
          ))
        : undefined;

      assist.forEach((as) => (as.created_at = as.created_at.toLocaleString()));

      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(assist);

      const workbook: XLSX.WorkBook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Assist");

      const buf = XLSX.write(workbook, {
        type: "buffer",
        bookType: "xlsx",
        Props: { Author: "AssistControl" },
      });

      return new Response(buf, {
        status: 200,
        headers: {
          "Content-Disposition": `attachment; filename="assist.xlsx"`,
          "Content-Type": "application/vnd.ms-excel",
        },
      });
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(assist);

    const workbook: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Assist");

    const buf = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
      Props: { Author: "AssistControl" },
    });

    return new Response(buf, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="assist.xlsx"`,
        "Content-Type": "application/vnd.ms-excel",
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Response.json(
        {
          status: "error",
          code: 500,
          message: error.message,
          data: { test: false },
        },
        { status: 500 }
      );
    } else {
      return Response.json(
        {
          status: "error",
          code: 500,
          message: "Algo salio mal vuelve a intentarlo luego.",
          data: { test: false },
        },
        { status: 500 }
      );
    }
  }
}

/*
    if (year || month || day) {
      year
        ? (assist = assist.filter(
            (as) => as.created_at.year === parseInt(year)
          ))
        : undefined;
      month
        ? (assist = assist.filter(
            (as) => as.created_at.month === parseInt(month)
          ))
        : undefined;
      day
        ? (assist = assist.filter((as) => as.created_at.day === parseInt(day)))
        : undefined;

        

      return Response.json(
        {
          status: "success",
          code: 200,
          message: "filtered assist request successfull",
          data: { assist: assist },
        },
        { status: 200 }
      );
    }
*/
