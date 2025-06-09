"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Link, Zap, CheckCircle, Globe } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = e.currentTarget.url.value;
    const BACKEND_SERVER =
      process.env.NEXT_PUBLIC_BACKEND_SERVER || "http://localhost:3000";

    const shortenedURL = await fetch(`${BACKEND_SERVER}/api/shorten`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    }).then((res) => res.json());

    console.log("Shortened URL: ", shortenedURL);

    setIsLoading(true);

    // Simulasi API call
    setTimeout(() => {
      setShortenedUrl("https://pendek.id/abc123");
      setIsLoading(false);
    }, 1500);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortenedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin: ", err);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-600 rounded-full blur-md opacity-20 scale-110"></div>
            <div className="relative p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg">
              <Link className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          Pemendek URL
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4 leading-relaxed">
          Ubah URL panjang Anda menjadi link pendek yang mudah dibagikan dalam
          hitungan detik
        </p>

        <div className="flex justify-center gap-2">
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-700 hover:bg-blue-200"
          >
            <Zap className="h-3 w-3 mr-1" />
            Cepat & Mudah
          </Badge>
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-700 hover:bg-green-200"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            100% Gratis
          </Badge>
        </div>
      </div>

      {/* Main Card */}
      <Card className="w-full max-w-2xl shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Perpendek Link Anda
          </CardTitle>
          <CardDescription className="text-gray-600 text-base">
            Masukkan URL panjang di bawah ini dan dapatkan versi pendeknya
            secara instan
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="url"
                className="text-sm font-medium text-gray-700 block"
              >
                Masukkan URL Anda
              </label>
              <Input
                id="url"
                name="url"
                type="url"
                placeholder="https://situs-anda-yang-panjang.com/dengan/parameter"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              />
            </div>

            <Button
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg"
              type="submit"
              disabled={isLoading || !url.trim()}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Sedang Memproses...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4" />
                  <span>Perpendek URL</span>
                </div>
              )}
            </Button>
          </form>

          {/* Result Section */}
          {shortenedUrl && (
            <Alert className="border-emerald-200 bg-emerald-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <AlertDescription className="text-emerald-800">
                <div className="space-y-4">
                  <p className="font-semibold text-base">
                    ✅ URL pendek Anda sudah siap!
                  </p>
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-emerald-100">
                    <Globe className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <code className="flex-1 text-sm text-gray-800 break-all font-mono">
                      {shortenedUrl}
                    </code>
                  </div>
                  <Button
                    onClick={handleCopy}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium"
                    size="sm"
                  >
                    {copied ? (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Berhasil Disalin!</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Copy className="h-4 w-4" />
                        <span>Salin ke Clipboard</span>
                      </div>
                    )}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Features */}
      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-white/50">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <Zap className="h-7 w-7 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 text-lg">
            Cepat & Mudah
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Dapatkan URL pendek dalam hitungan detik tanpa ribet
          </p>
        </div>

        <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-white/50">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <Link className="h-7 w-7 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 text-lg">
            URL Bersih
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Link pendek yang rapi dan mudah diingat
          </p>
        </div>

        <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-white/50">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <CheckCircle className="h-7 w-7 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 text-lg">
            Dapat Diandalkan
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Server stabil dengan uptime 99.9%
          </p>
        </div>
      </div>
    </main>
  );
}
