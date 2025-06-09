"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  Link,
  ExternalLink,
  AlertCircle,
  ArrowRight,
  Home,
} from "lucide-react";

export default function Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "error" | "redirecting">(
    "loading"
  );
  const [targetUrl, setTargetUrl] = useState<string>("");
  const [countdown, setCountdown] = useState(3);

  // Unwrap params using React.use()
  const { code } = use(params);

  useEffect(() => {
    const fetchData = async () => {
      const BACKEND_SERVER =
        process.env.NEXT_PUBLIC_BACKEND_SERVER ||
        "https://fc-short-link.vercel.app";

      try {
        const res = await fetch(`${BACKEND_SERVER}/api/expand`, {
          method: "POST",
          body: JSON.stringify({ hashCode: code }),
        });

        const data = await res.json();

        if (data.code === 200) {
          setTargetUrl(data.data);
          setStatus("redirecting");

          // Start countdown before redirect
          const countdownInterval = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(countdownInterval);
                router.replace(data.data);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

          return () => clearInterval(countdownInterval);
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("Failed to expand URL", err);
        setStatus("error");
      }
    };

    fetchData();
  }, [code, router]); // Now using 'code' instead of 'params.code'

  const handleManualRedirect = () => {
    if (targetUrl) {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleGoHome = () => {
    router.push("/");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-gray-100 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-lg opacity-20 scale-110"></div>
              <div className="relative p-4 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-xl border border-emerald-400/20">
                <Link className="h-8 w-8 text-white" strokeWidth={2} />
              </div>
            </div>
          </div>

          {/* Loading Animation */}
          <div className="mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600 mx-auto"></div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Processing Link...
          </h1>
          <p className="text-gray-600 text-lg">
            Please wait while we validate your short link
          </p>

          {/* Loading Dots */}
          <div className="flex justify-center space-x-2 mt-6">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "redirecting") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-gray-100 flex flex-col items-center justify-center p-4">
        <div className="max-w-lg w-full text-center">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-lg opacity-20 scale-110"></div>
              <div className="relative p-4 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-xl border border-emerald-400/20">
                <Link className="h-8 w-8 text-white" strokeWidth={2} />
              </div>
            </div>
          </div>

          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <ArrowRight
                className="h-8 w-8 text-emerald-600 animate-pulse"
                strokeWidth={2}
              />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Redirecting You Now
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            You&apos;ll be redirected in{" "}
            <span className="font-bold text-emerald-600 text-xl">
              {countdown}
            </span>{" "}
            seconds
          </p>

          {/* Target URL Display */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-emerald-100 shadow-lg mb-8">
            <p className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              Destination:
            </p>
            <code className="text-sm text-gray-800 break-all font-mono bg-gray-50 px-3 py-2 rounded-lg block">
              {targetUrl}
            </code>
          </div>

          {/* Manual Redirect Button */}
          <button
            onClick={handleManualRedirect}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-4 px-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3 group"
          >
            <ExternalLink className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span>Continue Immediately</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/30 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 rounded-2xl blur-lg opacity-20 scale-110"></div>
            <div className="relative p-4 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl shadow-xl border border-red-400/20">
              <Link className="h-8 w-8 text-white" strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Error Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="h-8 w-8 text-red-600" strokeWidth={2} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-red-600 mb-4">Link Not Found</h1>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          The short link you&apos;re trying to access doesn&apos;t exist, has
          expired, or may have been removed.
        </p>

        {/* Error Details */}
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-red-800 mb-3">Possible Reasons:</h3>
          <ul className="text-left text-red-700 space-y-2">
            <li>• The link may have been typed incorrectly</li>
            <li>• The short URL has expired</li>
            <li>• The link has been deactivated</li>
            <li>• There was a temporary server issue</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleGoHome}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-4 px-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3 group"
          >
            <Home className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span>Go to Homepage</span>
          </button>

          <button
            onClick={() => window.history.back()}
            className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-bold py-4 px-6 rounded-xl hover:bg-gray-50 transition-all duration-300"
          >
            Go Back
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12">
          <p className="text-gray-500 font-medium">
            Need help? Contact{" "}
            <span className="text-emerald-600 font-bold">Linkin</span> support
          </p>
        </div>
      </div>
    </div>
  );
}
