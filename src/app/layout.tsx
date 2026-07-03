import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Teste de Sensibilidade Alimentar - Quiz",
  description: "Descubra se seus sintomas digestivos recorrentes como gases e inchaço podem estar associados à intolerância a algum alimento e veja dicas práticas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Meta Pixel Code Placeholder */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1234567890'); // Substituir pelo Pixel ID real
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#F7F7F7]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
