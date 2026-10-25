import './globals.css';
import { AppProvider } from '../lib/ctx';
export const metadata = { title: 'KPL Puja Hisaab', manifest: '/manifest.json', appleWebApp: { capable: true, title: 'KPL' } };
export const viewport = { themeColor: '#8e1b14', width: 'device-width', initialScale: 1 };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="hi"><body><AppProvider>{children}</AppProvider></body></html>;
}
