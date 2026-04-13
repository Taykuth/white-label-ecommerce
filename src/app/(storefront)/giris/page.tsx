"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { brandConfig } from "../../../../brand.config";
import { Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email veya sifre hatali.");
    } else {
      router.push(redirect);
      router.refresh();
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{brandConfig.logoText}</CardTitle>
        <CardDescription>Hesabiniza giris yapin</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Sifre</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sifreniz"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Giris Yap
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Hesabiniz yok mu?{" "}
          <Link href="/kayit" className="text-primary hover:underline font-medium">
            Kayit Ol
          </Link>
        </p>
        <div className="mt-4 p-3 bg-gray-50 rounded-md text-xs text-gray-500">
          <p className="font-medium mb-1">Demo Hesaplar:</p>
          <p>Admin: admin@modavitrin.com / admin123</p>
          <p>Musteri: musteri@example.com / musteri123</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <Suspense fallback={<div className="text-center py-16"><Loader2 className="animate-spin mx-auto" /></div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
