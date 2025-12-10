import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { fromName, from, to, replyTo, cc, bcc, subject, html, attachments } =
      body;
    if (!fromName || !from || !to || !subject || !html) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const payload = {
      fromName,
      fromEmail: from,
      to,
      replyTo,
      cc,
      bcc,
      subject,
      html,
      attachments,
    };

    const serverEndpoint = process.env.MAIL_SERVER_ENDPOINT;
    if (!serverEndpoint) {
      return NextResponse.json(
        { success: false, message: "MAIL_SERVER_ENDPOINT missing in .env" },
        { status: 500 }
      );
    }

    await axios.post(serverEndpoint, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.MAIL_SERVER_API_KEY || "",
      },
      timeout: 15000,
    });

    return NextResponse.json({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("SEND API ERROR:", error?.response?.data || error?.message);

    return NextResponse.json(
      {
        success: false,
        message: "Mail server error",
        error: error?.response?.data || error?.message,
      },
      { status: 500 }
    );
  }
}
