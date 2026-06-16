import type { Metadata } from "next";
import "./globals.css";
import { PremiumProvider } from "@/lib/premium-context";

export const metadata: Metadata = {
  title: "Codevance — Track Your Journey to AI Engineer",
  description: "Master Python, Java, SQL, Data Science, ML, and AI Engineering with AI-generated quizzes, live code execution, and real progress tracking.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PremiumProvider>
          {children}
        </PremiumProvider>
      </body>
    </html>
  );
}
