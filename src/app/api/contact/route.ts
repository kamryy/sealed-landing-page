import { addContactForm } from "@/lib/contact-db";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      message?: string;
    };
    const email = body.email?.trim().toLowerCase();
    const message = body.message?.trim() || undefined;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 },
      );
    }

    await addContactForm(email, undefined, message);

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully!",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "An unexpected error occurred", details: errorMessage },
      { status: 500 },
    );
  }
}
