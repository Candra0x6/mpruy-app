import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import { type ReactNode } from 'react'
import { cookieToInitialState } from 'wagmi'

import { getConfig } from '../wagmi'
import { Providers } from './providers'
import { Header } from '../components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MPRUY | Next-Gen Prediction Market',
  description: 'A premium decentralized prediction market powered by Web3 technologies.',
}

export default async function RootLayout(props: { children: ReactNode }) {
  const initialState = cookieToInitialState(
    getConfig(),
    (await headers()).get('cookie'),
  )
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-obsidian text-slate-200 antialiased`}>
        <Providers initialState={initialState}>
          <Header />
          <main className="min-h-screen bg-obsidian">
            {props.children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
