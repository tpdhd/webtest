import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "3D Print Showcase",
  description: "Showcase and discover amazing 3D prints",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
