import clientPromise from "@/libs/mongodb/mongodb";
import { Db, Document, InsertOneResult, MongoClient, WithId } from "mongodb";
import { NextRequest } from "next/server";
import { Assist } from "./types";

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

    return Response.json(
      {
        status: "success",
        code: 200,
        message: "assist request successfull",
        data: { assist },
      },
      { status: 200 }
    );
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

export async function POST(req: NextRequest) {
  try {
    const data: Partial<Assist> = await req.json();
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("assist_control");

    const assist: Partial<Assist> = {
      name: data.name,
      subname: data.subname,
      created_at: {
        year: new Date().getFullYear(),
        month: data.created_at?.month || new Date().getMonth() + 1,
        day: data.created_at?.day || new Date().getUTCDate(),
        hour: data.created_at?.hour || new Date().getHours(),
        minute: data.created_at?.minute || new Date().getMinutes(), // Descubrir porque cuando data.minute es 0 se usa new Date
      },
    };

    const added: InsertOneResult<Document> = await db
      .collection("assist")
      .insertOne(assist);

    return Response.json(
      {
        status: "success",
        code: 201,
        message: "assist creation successfull",
        data: { assist, added: added.acknowledged, id: added.insertedId },
      },
      { status: 201 }
    );
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

export async function DELETE(req: NextRequest) {
  try {
    const data: Partial<Assist> = await req.json();
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("assist_control");

    // BORRAR TODAS LAS ASSIST MAYORES A 1 SEMANA

    return Response.json(
      {
        status: "success",
        code: 201,
        message: "assist creation successfull",
        data: {},
      },
      { status: 201 }
    );
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
