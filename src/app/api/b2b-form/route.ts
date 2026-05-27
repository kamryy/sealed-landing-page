import { addB2bForm } from "@/lib/b2b-form-db";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      fullName?: string;
      organization?: string;
      role?: string;
      workflow?: string;
    };
    const email = body.email?.trim().toLowerCase();
    const fullName = body.fullName?.trim() || undefined;
    const organization = body.organization?.trim() || undefined;
    const role = body.role?.trim() || undefined;
    const workflow = body.workflow?.trim() || undefined;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 },
      );
    }

    await addB2bForm(email, fullName, null, organization, role, workflow);

    return NextResponse.json(
      {
        success: true,
        message: "Form submitted successfully!",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("B2B form error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "An unexpected error occurred", details: errorMessage },
      { status: 500 },
    );
  }
}
