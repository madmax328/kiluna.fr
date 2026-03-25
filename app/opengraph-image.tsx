import { ImageResponse } from "next/og";

export const alt = "Kiluna — Détecteur de clauses abusives dans vos contrats";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.07) 0%, transparent 40%)",
          }}
        />

        {/* Shield icon */}
        <div
          style={{
            width: 80,
            height: 80,
            background: "rgba(255,255,255,0.15)",
            borderRadius: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
            fontSize: 44,
          }}
        >
          🛡️
        </div>

        {/* Brand */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "white",
            letterSpacing: "-2px",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 0,
          }}
        >
          kiluna
          <span style={{ color: "rgba(147,197,253,1)" }}>.fr</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "rgba(191,219,254,0.9)",
            fontWeight: 500,
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.4,
            marginBottom: 48,
          }}
        >
          Détecte les clauses abusives dans tes contrats — en 60 secondes
        </div>

        {/* Pills */}
        <div style={{ display: "flex", gap: 16 }}>
          {["🔒 Confidentiel", "⚡ 60 secondes", "💳 2,99€"].map((label) => (
            <div
              key={label}
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 50,
                padding: "10px 22px",
                color: "white",
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
