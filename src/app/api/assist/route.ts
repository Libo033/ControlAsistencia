import clientPromise from "@/libs/mongodb/mongodb";
import { Db, Document, InsertOneResult, MongoClient, WithId } from "mongodb";
import { NextRequest } from "next/server";
import { Assist, AssistPost } from "./types";

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
    const data: Partial<AssistPost> = await req.json();
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("assist_control");
    const year: number = data.year || new Date().getFullYear();
    const month: number = data.month ? data.month - 1 : new Date().getMonth();
    const day: number = data.day || new Date().getDate();
    const hour: number = data.hour || new Date().getHours();
    const minute: number = data.minute || new Date().getMinutes();

    const assist: Partial<Assist> = {
      name: data.name,
      subname: data.subname,
      created_at: new Date(Date.UTC(year, month, day, hour, minute)),
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
