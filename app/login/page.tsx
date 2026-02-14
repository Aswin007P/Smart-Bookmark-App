"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/browser";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/dashboard");
      } else {
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        router.push("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // Parallax effect on mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 animate-gradient-xy">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-white/20 rounded-full backdrop-blur-sm animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 animate-gradient-xy p-4 overflow-hidden relative"
      onMouseMove={handleMouseMove}
    >
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Main card with 3D tilt effect */}
        <div 
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden transform-gpu transition-all duration-300 hover:shadow-3xl"
          style={{
            transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg) scale(1.02)`,
          }}
        >
          {/* Animated gradient header */}
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-8 py-12 text-center overflow-hidden group">
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            {/* Animated circles */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-20 -translate-y-20 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-20 translate-y-20 animate-pulse animation-delay-1000"></div>
            
            {/* Logo with animation */}
            <div className="relative mb-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-white/20 to-white/5 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/30 shadow-2xl animate-float">
                <span className="text-white text-5xl font-bold animate-pulse-scale">B</span>
              </div>
              {/* Orbiting rings */}
              <div className="absolute inset-0 animate-spin-slow">
                <div className="absolute top-0 left-1/2 w-1 h-1 bg-white rounded-full"></div>
              </div>
              <div className="absolute inset-0 animate-spin-slow animation-delay-500">
                <div className="absolute top-0 left-1/2 w-1 h-1 bg-pink-300 rounded-full"></div>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-white mb-2 animate-fade-in-up">
              Smart Bookmark App
            </h1>
            <p className="text-blue-100 text-lg animate-fade-in-up animation-delay-200">
              Save and organize your favorite links
            </p>

            {/* Decorative elements */}
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-40 h-10 bg-white/20 blur-xl rounded-full"></div>
          </div>
          
          <div className="p-8">
            {/* Error message with animation */}
            {error && (
              <div className="mb-6 p-4 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-xl animate-shake">
                <p className="text-red-600 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-2 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            {/* Google Sign-in Button with advanced animations */}
            <button
              onClick={handleGoogleLogin}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="relative w-full flex items-center justify-center gap-3 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl px-6 py-4 text-gray-700 font-medium 
                hover:border-transparent hover:shadow-2xl hover:scale-105
                active:scale-95 active:shadow-lg
                focus:outline-none focus:ring-4 focus:ring-blue-500/50
                transition-all duration-300 group overflow-hidden"
            >
              {/* Animated background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              {/* Shine effect */}
              <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full ${isHovering ? 'animate-shine' : ''}`} />
              
              {/* Google Icon with spin animation */}
              <div className={`relative transition-transform duration-500 ${isHovering ? 'rotate-180 scale-110' : ''}`}>
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>

              {/* Text with slide animation */}
              <span className={`relative text-lg font-semibold transition-all duration-300 ${isHovering ? 'tracking-wider' : ''}`}>
                Continue with Google
              </span>

              {/* Animated dots on hover */}
              {isHovering && (
                <span className="absolute right-6 flex gap-1">
                  <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-1 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-1 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              )}
            </button>

            {/* Decorative text with animation */}
            <p className="mt-8 text-center text-sm text-gray-500 animate-fade-in-up animation-delay-400">
              <span className="inline-block animate-pulse mr-1">✨</span>
              Securely manage all your bookmarks in one place
              <span className="inline-block animate-pulse ml-1">✨</span>
            </p>

            {/* Feature badges */}
            <div className="mt-6 flex justify-center gap-3">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full animate-fade-in-up animation-delay-600 hover:scale-110 transition-transform">
                🚀 Realtime Sync
              </span>
              <span className="px-3 py-1 bg-purple-50 text-purple-600 text-xs rounded-full animate-fade-in-up animation-delay-700 hover:scale-110 transition-transform">
                🔒 Secure
              </span>
              <span className="px-3 py-1 bg-pink-50 text-pink-600 text-xs rounded-full animate-fade-in-up animation-delay-800 hover:scale-110 transition-transform">
                ⚡ Fast
              </span>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-sm text-white/80 animate-fade-in">
          © {new Date().getFullYear()} Smart Bookmark App. All rights reserved.
        </p>
      </div>
    </div>
  );
}