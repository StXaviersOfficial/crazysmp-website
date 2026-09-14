/**
 * GET /api/server-status
 *
 * Pings the Minecraft server at crazynetwork.mc-connect.xyz:25569 using
 * the standard Server List Ping (SLP) protocol (no third-party deps).
 *
 * Returns: { online: boolean, players?: { online, max }, version?, description? }
 * Cached for 15 seconds via Cache-Control to avoid spamming the server.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HOST = "crazynetwork.mc-connect.xyz";
const PORT = 25569;

function writeVarInt(value: number): Buffer {
  const bytes: number[] = [];
  let v = value >>> 0;
  do {
    let temp = v & 0x7f;
    v >>>= 7;
    if (v !== 0) temp |= 0x80;
    bytes.push(temp);
  } while (v !== 0);
  return Buffer.from(bytes);
}

function readVarInt(buf: Buffer, offset: number): { value: number; bytesRead: number } {
  let result = 0;
  let shift = 0;
  let bytesRead = 0;
  let cursor = offset;
  let byte: number;
  do {
    if (cursor >= buf.length) throw new Error("VarInt out of bounds");
    byte = buf[cursor++];
    result |= (byte & 0x7f) << shift;
    shift += 7;
    bytesRead++;
  } while ((byte & 0x80) !== 0);
  return { value: result, bytesRead };
}

function encodeString(str: string): Buffer {
  const utf8 = Buffer.from(str, "utf8");
  return Buffer.concat([writeVarInt(utf8.length), utf8]);
}

function buildHandshake(): Buffer {
  const portBuf = Buffer.alloc(2);
  portBuf.writeUInt16BE(PORT);
  const inner = Buffer.concat([
    writeVarInt(0),           // packet ID 0 (handshake)
    writeVarInt(0xffffffff),  // protocol version -1 (ping)
    encodeString(HOST),
    portBuf,                  // port as unsigned big-endian short
    writeVarInt(1),            // next state = 1 (status)
  ]);
  return Buffer.concat([writeVarInt(inner.length), inner]);
}

function buildStatusRequest(): Buffer {
  const inner = writeVarInt(0);
  return Buffer.concat([writeVarInt(inner.length), inner]);
}

async function pingServer(): Promise<{
  online: boolean;
  players?: { online: number; max: number };
  version?: string;
  description?: string;
}> {
  return new Promise((resolve) => {
    const net = require("net");
    const socket = new net.Socket();
    socket.setTimeout(5000);
    let received = Buffer.alloc(0);
    let resolved = false;

    const done = (result: any) => {
      if (resolved) return;
      resolved = true;
      socket.destroy();
      resolve(result);
    };

    socket.on("connect", () => {
      socket.write(buildHandshake());
      socket.write(buildStatusRequest());
    });

    socket.on("data", (chunk: Buffer) => {
      received = Buffer.concat([received, chunk]);
      try {
        let offset = 0;
        const { bytesRead: lenBytes } = readVarInt(received, offset);
        offset += lenBytes;
        const { bytesRead: idBytes } = readVarInt(received, offset);
        offset += idBytes;
        const { value: strLen, bytesRead: strLenBytes } = readVarInt(received, offset);
        offset += strLenBytes;
        if (received.length >= offset + strLen) {
          const json = JSON.parse(received.slice(offset, offset + strLen).toString("utf8"));
          done({
            online: true,
            players: {
              online: json.players?.online ?? 0,
              max: json.players?.max ?? 0,
            },
            version: json.version?.name,
            description: typeof json.description === "string"
              ? json.description
              : json.description?.text || json.description?.extra?.map((e: any) => e.text).join(""),
          });
        }
      } catch {
        // Not enough data yet, keep waiting
      }
    });

    socket.on("timeout", () => done({ online: false }));
    socket.on("error", () => done({ online: false }));

    socket.connect(PORT, HOST);
  });
}

export async function GET() {
  const status = await pingServer();
  return Response.json(status, {
    headers: {
      "Cache-Control": "public, s-maxage=15, stale-while-revalidate=30",
    },
  });
}
