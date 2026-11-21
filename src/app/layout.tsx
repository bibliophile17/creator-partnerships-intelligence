import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creator Partnerships Intelligence",
  description:
    "India market intelligence and YouTube brand deal strategy workbench. Portfolio project; all campaign data is simulated.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
