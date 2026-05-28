import { addB2cForm } from "@/lib/b2c-form-db";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      platform?: string;
      internetHandle?: string;
    };
    const email = body.email?.trim().toLowerCase();
    const platform = body.platform?.trim() || undefined;
    const internetHandle = body.internetHandle?.trim() || undefined;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 },
      );
    }

    await addB2cForm(email, null, platform, internetHandle);

    return NextResponse.json(
      {
        success: true,
        message: "Form submitted successfully!",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("B2C form error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "An unexpected error occurred", details: errorMessage },
      { status: 500 },
    );
  }
}
