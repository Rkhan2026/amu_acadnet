import { NextResponse } from "next/server";
import { getCollaboratorRecommendations } from "@/lib/recommendations/engine";
import { getSession } from "@/lib/session"; // Assuming session helper exists

export async function GET(_request) {
  try {
    const session = await getSession();

    if (!session || !session.universityID) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recommendations = await getCollaboratorRecommendations(
      session.universityID,
    );

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("Error in recommendations API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
