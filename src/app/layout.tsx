import "./globals.css"

export const metadata = {
  title: "InsightBiz",
  description: "Монголын ЖДҮ-д зориулсан data-driven платформ",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="mn">
      <body className="bg-white text-gray-900">
        {children}
      </body>
    </html>
  )
}