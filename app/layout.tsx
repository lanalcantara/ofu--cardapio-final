import type { Metadata } from 'next'
import { Inter, Fredoka, Quicksand } from "next/font/google";
import './globals.css'
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'Ofuê Doceria',
  description: 'Doceria Artesanal em Recife',
}

const inter = Inter({ subsets: ["latin"] });
const fredoka = Fredoka({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: '--font-fredoka' });
const quicksand = Quicksand({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: '--font-quicksand' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} ${fredoka.variable} ${quicksand.variable} font-quicksand`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
