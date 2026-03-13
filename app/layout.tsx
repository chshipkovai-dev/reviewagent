import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider, BackgroundOrbs } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "InvoicePilot — Stop chasing clients for money",
  description: "AI writes your invoice follow-up emails. Friendly, Firm, and Final Notice — ready in 10 seconds.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <BackgroundOrbs />
          <div className="page-content">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
