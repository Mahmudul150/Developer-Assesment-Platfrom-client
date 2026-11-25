import Link from "next/link";
import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import { Navbar } from "@/components/layout/navbar";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div>
       <Navbar/>
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-md">
       
        <Card>
          <CardContent className="pt-6">
            
            {children}
            </CardContent>
        </Card>
      </div>
    </div>
    </div>
  );
}
