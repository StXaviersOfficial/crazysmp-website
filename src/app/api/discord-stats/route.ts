/**
 * GET /api/discord-stats
 *
 * Fetches live Discord guild member counts via the public invite API.
 * No bot token needed — uses the invite code we already have on the site.
 *
 * Returns: { members: number, online: number, name?: string }
 * Cached for 60 seconds (Discord doesn't update counts in real-time anyway).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DISCORD_INVITE_CODE = "GFzAeUj7TJ";

export async function GET() {
  try {
    const res = await fetch(
      `https://discord.com/api/v9/invites/${DISCORD_INVITE_CODE}?with_counts=true`,
      {
        headers: { "User-Agent": "CrazySMP-Store/1.0" },
      }
    );
    if (!res.ok) throw new Error(`Discord API ${res.status}`);
    const data = await res.json();
    return Response.json(
      {
        members: data.approximate_member_count ?? 0,
        online: data.approximate_presence_count ?? 0,
        name: data.guild?.name,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch {
    return Response.json(
      { members: 0, online: 0, error: true },
      { status: 200 }
    );
  }
}
