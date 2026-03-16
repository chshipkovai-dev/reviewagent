import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider, BackgroundOrbs } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "ReviewAgent — AI replies to your Google reviews",
  description: "AI writes professional responses to your Google reviews in seconds. Paste reviews, get ready-to-post replies.",
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
