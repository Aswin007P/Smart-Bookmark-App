"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase/browser";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        alert("Failed to sign out. Please try again.");
        return;
      }

      router.push("/login");
      router.refresh();
      
    } catch (error) {
      console.error("Unexpected logout error:", error);
      alert("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={loading}
      className="relative inline-flex items-center px-4 py-2 overflow-hidden rounded-xl group"
    >
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500 ease-out
        ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
      </div>
      
      {/* Border glow effect */}
      <div className={`absolute inset-0 rounded-xl border-2 border-red-200 transition-all duration-300
        ${isHovered ? 'border-red-400 scale-105' : 'border-gray-200'}`}>
      </div>
      
      {/* Shine effect */}
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full 
        ${isHovered ? 'animate-shine' : ''}`}>
      </div>
      
      {/* Background blur dots */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-300 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-red-300 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 animation-delay-200"></div>
      
      {/* Button content */}
      <span className="relative flex items-center gap-2 text-sm font-medium">
        {loading ? (
          <>
            {/* Animated loading spinner */}
            <span className="relative">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {/* Pulsing ring */}
              <span className="absolute inset-0 animate-ping opacity-20">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </span>
            <span className={`transition-all duration-300 ${isHovered ? 'tracking-wider' : ''}`}>
              Signing out...
            </span>
          </>
        ) : (
          <>
            {/* Logout icon with animations */}
            <span className="relative">
              <svg 
                className={`w-4 h-4 transition-all duration-300 ${isHovered ? 'rotate-12 scale-110' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                />
              </svg>
              {/* Animated dot that appears on hover */}
              <span className={`absolute -top-1 -right-1 w-1.5 h-1.5 bg-red-400 rounded-full transition-all duration-300 
                ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
              </span>
            </span>
            
            {/* Text with hover animation */}
            <span className={`relative transition-all duration-300 ${isHovered ? 'tracking-wider text-white' : 'text-gray-700'}`}>
              Sign Out
              {/* Underline animation */}
              <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-white transform origin-left transition-transform duration-300 
                ${isHovered ? 'scale-x-100' : 'scale-x-0'}`}>
              </span>
            </span>
            
            {/* Arrow icon that appears on hover */}
            <svg 
              className={`w-3 h-3 transition-all duration-300 absolute right-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-4
                ${isHovered ? 'opacity-100 translate-x-4' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        )}
      </span>

      {/* Ripple effect on click (via CSS pseudo-element) */}
      <span className="absolute inset-0 overflow-hidden rounded-xl">
        <span className="absolute inset-0 bg-white/20 transform scale-0 rounded-full opacity-0 group-active:scale-100 group-active:opacity-100 transition-all duration-500"></span>
      </span>
    </button>
  );
}