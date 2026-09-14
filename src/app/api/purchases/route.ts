/**
 * GET /api/purchases?username=Steve
 *
 * Fetches purchase history for a given Minecraft username from Firestore.
 *
 * Firestore collection: `purchases`
 * Document fields: { username, pkgId, packageName, price, status, createdAt }
 *
 * Returns: { purchases: [...] }
 * Sorted by createdAt descending (newest first).
 *
 * If Firebase isn't initialized (missing env vars) or Firestore has no
 * documents for this user, returns an empty array.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { db } from "@/lib/firebase-admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username")?.trim();

  if (!username) {
    return Response.json({ purchases: [], error: "Missing username" }, { status: 400 });
  }

  // If Firebase isn't initialized, return empty (no purchases yet)
  if (!db) {
    return Response.json({ purchases: [], note: "Database not configured" });
  }

  try {
    const snapshot = await db
      .collection("purchases")
      .where("username", "==", username)
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const purchases = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        pkgId: data.pkgId,
        packageName: data.packageName,
        price: data.price,
        status: data.status,
        createdAt: data.createdAt?.toMillis?.() ?? data.createdAt ?? Date.now(),
      };
    });

    return Response.json({ purchases });
  } catch (error) {
    console.error("[api/purchases] Error:", error);
    return Response.json({ purchases: [], error: "Failed to fetch" });
  }
}
