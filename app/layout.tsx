import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "InvoicePilot — Stop chasing clients for money",
  description: "AI writes your invoice follow-up emails. Friendly, Firm, and Final Notice — ready in 10 seconds.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
