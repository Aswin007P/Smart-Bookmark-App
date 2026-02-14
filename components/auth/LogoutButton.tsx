"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase/browser";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
      disabled={loading}
      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white 
        hover:bg-red-50 hover:text-red-600 hover:border-red-200 hover:shadow-md hover:scale-105
        active:scale-95 active:bg-red-100
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1
        disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-gray-700 disabled:hover:scale-100
        transition-all duration-200 group"
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin mr-2" />
          <span>Signing out...</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="group-hover:translate-x-0.5 transition-transform">Sign Out</span>
        </>
      )}
    </button>
  );
}