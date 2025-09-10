import './globals.css'
import { Inter } from 'next/font/google'
import { NavigationProvider } from '@/context/NavigationContext'
import { APP_NAME, APP_DESCRIPTION } from '@/constants'
import LayoutContent from './LayoutContent'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: APP_NAME + ' - Next-Gen Messaging',
  description: APP_DESCRIPTION,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <NavigationProvider>
          <LayoutContent>
            {children}
          </LayoutContent>
        </NavigationProvider>
      </body>
    </html>
  )
}