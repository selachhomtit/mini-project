import { ImageResponse } from "next/og";
import { SITE } from "@/lib/seo";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #06110d 0%, #064E3B 60%, #059669 100%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 40, fontWeight: 700 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "#059669", display: "flex" }} />
          {SITE.name}
        </div>
        <div style={{ fontSize: 72, fontWeight: 800, marginTop: 40, lineHeight: 1.1 }}>{SITE.tagline}</div>
        <div style={{ fontSize: 30, marginTop: 28, opacity: 0.8 }}>
          Kanban boards · Team workspaces · English &amp; Khmer
        </div>
      </div>
    ),
    size,
  );
}
