import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // If user is already logged in, go to dashboard
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden relative">
      {/* Animated background patterns */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse-slow"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-white/10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative min-h-screen flex items-center justify-center p-4 z-10">
        <div className="max-w-5xl mx-auto">
          {/* Hero section with animation */}
          <div className="text-center mb-12 animate-fade-in-down">
            {/* Animated logo */}
            <div className="relative inline-block mb-8 group">
              <div className="w-28 h-28 mx-auto bg-gradient-to-br from-white/20 to-white/5 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/30 shadow-2xl animate-float">
                <span className="text-white text-6xl font-bold animate-pulse-scale">B</span>
              </div>
              
              {/* Orbiting rings */}
              <div className="absolute inset-0 animate-spin-slow">
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="absolute inset-0 animate-spin-slow animation-delay-500">
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-pink-300 rounded-full"></div>
              </div>
              
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-2xl opacity-30 animate-pulse-slow"></div>
            </div>

            {/* Main heading with gradient */}
            <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-slide-up">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Smart Bookmark App
              </span>
            </h1>
            
            {/* Subheading with animation */}
            <p className="text-2xl text-white/90 mb-12 max-w-3xl mx-auto animate-slide-up animation-delay-200">
              Organize, manage, and sync your bookmarks in real-time across all your devices
            </p>

            {/* CTA Button with advanced animations */}
            <div className="animate-slide-up animation-delay-400">
              <Link
                href="/login"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-300 transform hover:scale-110"
              >
                {/* Button background with gradient */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl"></span>
                
                {/* Animated border */}
                <span className="absolute inset-0 w-full h-full rounded-2xl border-2 border-white/20 group-hover:border-white/40 transition-all duration-300"></span>
                
                {/* Glow effect on hover */}
                <span className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></span>
                
                {/* Button content */}
                <span className="relative flex items-center gap-3">
                  <span>Get Started</span>
                  <svg 
                    className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          {/* Feature cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            {[
              {
                icon: "🚀",
                title: "Real-time Sync",
                description: "Bookmarks update instantly across all your devices",
                color: "from-blue-500 to-blue-600",
                delay: "600ms"
              },
              {
                icon: "🔒",
                title: "Secure & Private",
                description: "Your bookmarks are private and protected with Google Auth",
                color: "from-purple-500 to-purple-600",
                delay: "700ms"
              },
              {
                icon: "⚡",
                title: "Lightning Fast",
                description: "Instant access to your saved links with smart organization",
                color: "from-pink-500 to-pink-600",
                delay: "800ms"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative animate-slide-up"
                style={{ animationDelay: feature.delay }}
              >
                {/* Card background with glass effect */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 group-hover:border-white/40 transition-all duration-300"></div>
                
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300`}></div>
                
                {/* Card content */}
                <div className="relative p-6 text-center">
                  <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 text-sm group-hover:text-white/90 transition-colors">
                    {feature.description}
                  </p>
                  
                  {/* Decorative line */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-12 h-0.5 bg-white rounded-full transition-all duration-300"></div>
                </div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full" 
                  style={{ backgroundSize: '200% 100%' }} />
              </div>
            ))}
          </div>

          {/* Stats section */}
          <div className="mt-20 grid grid-cols-3 gap-4 text-center animate-slide-up animation-delay-1000">
            <div className="group">
              <div className="text-3xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">
                10K+
              </div>
              <div className="text-white/70 text-sm">Active Users</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">
                50K+
              </div>
              <div className="text-white/70 text-sm">Bookmarks Saved</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">
                99.9%
              </div>
              <div className="text-white/70 text-sm">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-white/50 text-sm z-10 animate-fade-in animation-delay-1200">
        © {new Date().getFullYear()} Smart Bookmark App. All rights reserved.
      </div>
    </div>
  );
}