import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a1a 0%, #0d0d2b 50%, #080818 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #00E5FF 0%, #0088aa 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: 800,
              color: "#000",
            }}
          >
            CC
          </div>
          <span
            style={{
              fontSize: "48px",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            Command Center
          </span>
        </div>
        <span
          style={{
            fontSize: "20px",
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.05em",
          }}
        >
          Powered by Creative Division
        </span>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
