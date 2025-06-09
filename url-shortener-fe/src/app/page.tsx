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
import {
  Copy,
  Link,
  Zap,
  CheckCircle,
  Globe,
  AlertCircle,
  ExternalLink,
  Shield,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset states
    setIsLoading(true);
    setError("");
    setShortUrl("");
    setCopied(false);

    try {
      const BACKEND_SERVER =
        process.env.NEXT_PUBLIC_BACKEND_SERVER || "http://localhost:3000";
      const FRONTEND_SERVER =
        process.env.NEXT_PUBLIC_FRONTEND_SERVER || "http://localhost:3001";

      const response = await fetch(`${BACKEND_SERVER}/api/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const shortenedURL = await response.json();

      if (shortenedURL.code === 200) {
        const finalUrl = shortenedURL.data.startsWith("http")
          ? shortenedURL.data
          : `${FRONTEND_SERVER}/${shortenedURL.data}`;

        setShortUrl(finalUrl);
      } else {
        throw new Error(shortenedURL.message || "Failed to shorten URL");
      }
    } catch (err) {
      console.error("Error shortening URL:", err);
      setError(err.message || "An error occurred while shortening the URL");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shortUrl || isCopying) return;

    setIsCopying(true);

    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy:", err);
      setError("Failed to copy to clipboard");
    } finally {
      setIsCopying(false);
    }
  };

  const resetForm = () => {
    setUrl("");
    setShortUrl("");
    setError("");
    setCopied(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-gray-100 flex flex-col items-center justify-center p-4">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-lg opacity-20 scale-110 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="relative p-5 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-xl border border-emerald-400/20">
              <Link className="h-10 w-10 text-white" strokeWidth={2} />
            </div>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
          Linkin
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6 leading-relaxed font-medium">
          Professional URL shortening service for modern businesses
        </p>

        <div className="flex justify-center gap-3">
          <Badge
            variant="secondary"
            className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 px-4 py-2 text-sm font-medium border border-emerald-200"
          >
            <Zap className="h-4 w-4 mr-2" />
            Lightning Fast
          </Badge>
          <Badge
            variant="secondary"
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 text-sm font-medium border border-gray-200"
          >
            <Shield className="h-4 w-4 mr-2" />
            Secure & Reliable
          </Badge>
        </div>
      </div>

      {/* Main Card */}
      <Card className="w-full max-w-3xl shadow-2xl border border-gray-200/50 bg-white backdrop-blur-sm">
        <CardHeader className="text-center pb-8 px-8 pt-8">
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
            Shorten Your Links
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg max-w-md mx-auto">
            Transform long URLs into clean, professional short links instantly
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 px-8 pb-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <label
                htmlFor="url"
                className="text-sm font-semibold text-gray-800 block uppercase tracking-wide"
              >
                Enter Your URL
              </label>
              <Input
                id="url"
                name="url"
                type="url"
                placeholder="https://your-very-long-website-url.com/with/parameters"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                className="h-14 text-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl disabled:opacity-50 bg-gray-50/50 font-medium"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading && url.trim()) {
                    handleSubmit(e);
                  }
                }}
              />
            </div>

            <div className="flex gap-4">
              <Button
                className="flex-1 h-14 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl disabled:opacity-50 border border-emerald-500"
                onClick={handleSubmit}
                disabled={isLoading || !url.trim()}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Zap className="h-5 w-5" />
                    <span>Shorten URL</span>
                  </div>
                )}
              </Button>

              {(shortUrl || error) && (
                <Button
                  variant="outline"
                  onClick={resetForm}
                  disabled={isLoading}
                  className="h-14 px-6 border-2 border-gray-300 hover:bg-gray-50 rounded-xl disabled:opacity-50 font-semibold"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Error Section */}
          {error && (
            <Alert className="border-2 border-red-200 bg-red-50 rounded-xl p-6">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <AlertDescription className="text-red-800">
                <p className="font-bold text-lg">Error Occurred</p>
                <p className="text-base mt-2">{error}</p>
              </AlertDescription>
            </Alert>
          )}

          {/* Success Section */}
          {shortUrl && !error && (
            <Alert className="border-2 border-emerald-200 bg-emerald-50 rounded-xl p-6">
              <CheckCircle className="h-6 w-6 text-emerald-600 " />
              <AlertDescription className="text-emerald-800">
                <div className="space-y-6 w-full">
                  <p className="font-bold text-xl">Your short link is ready!</p>
                  <div className="flex items-center space-x-4 p-4 bg-white rounded-xl border-2 border-emerald-100 shadow-sm">
                    <Globe className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    <code className="flex-1 text-sm text-gray-800 break-all font-mono font-semibold">
                      {shortUrl}
                    </code>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      onClick={handleCopy}
                      disabled={isCopying}
                      className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold disabled:opacity-50 shadow-lg"
                    >
                      {isCopying ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>Copying...</span>
                        </div>
                      ) : copied ? (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5" />
                          <span>Copied!</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Copy className="h-5 w-5" />
                          <span>Copy Link</span>
                        </div>
                      )}
                    </Button>

                    <Button
                      onClick={() =>
                        window.open(shortUrl, "_blank", "noopener,noreferrer")
                      }
                      variant="outline"
                      className="flex-1 h-12 border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl font-bold"
                    >
                      <div className="flex items-center space-x-2">
                        <ExternalLink className="h-5 w-5" />
                        <span>Open Link</span>
                      </div>
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Features */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-100 group">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
            <Zap className="h-8 w-8 text-white" strokeWidth={2} />
          </div>
          <h3 className="font-bold text-gray-900 mb-3 text-xl">
            Lightning Fast
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Get your shortened URLs in milliseconds with our optimized
            infrastructure
          </p>
        </div>

        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-100 group">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
            <Shield className="h-8 w-8 text-white" strokeWidth={2} />
          </div>
          <h3 className="font-bold text-gray-900 mb-3 text-xl">
            Enterprise Security
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Bank-level security with SSL encryption and fraud protection
          </p>
        </div>

        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-100 group">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
            <TrendingUp className="h-8 w-8 text-white" strokeWidth={2} />
          </div>
          <h3 className="font-bold text-gray-900 mb-3 text-xl">99.9% Uptime</h3>
          <p className="text-gray-600 leading-relaxed">
            Reliable service with global CDN and redundant server infrastructure
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 text-center">
        <p className="text-gray-500 font-medium">
          Powered by <span className="text-emerald-600 font-bold">Linkin</span>{" "}
          - Professional URL Management
        </p>
      </div>
    </main>
  );
}
