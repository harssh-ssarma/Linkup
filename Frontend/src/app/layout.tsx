import './globals.css'
import { Inter } from 'next/font/google'
import { NavigationProvider } from '@/context/NavigationContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider } from '@/context/AuthContext'
import { APP_NAME, APP_DESCRIPTION } from '@/constants'

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
        <AuthProvider>
          <ThemeProvider>
            <NavigationProvider>
              {children}
            </NavigationProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}