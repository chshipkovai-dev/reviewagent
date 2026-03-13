import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "InvoicePilot — Stop chasing clients for money",
  description: "AI writes your invoice follow-up emails. You approve and send in 10 seconds.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
