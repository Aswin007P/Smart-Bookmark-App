"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/browser";

export default function BookmarkForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [focused, setFocused] = useState<"title" | "url" | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!userId) {
      setError("You must be logged in to add bookmarks");
      return;
    }

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!url.trim()) {
      setError("URL is required");
      return;
    }

    if (!validateUrl(url)) {
      setError("Please enter a valid URL (include http:// or https://)");
      return;
    }

    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from("bookmarks")
        .insert([{ 
          title: title.trim(), 
          url: url.trim(),
          user_id: userId
        }]);

      if (insertError) throw insertError;

      setTitle("");
      setUrl("");
      setError("");
      router.refresh();
      
    } catch (err: any) {
      console.error("Bookmark error:", err);
      setError(err.message || "Failed to add bookmark");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error Message */}
      {error && (
        <div className="relative bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 animate-slide-down overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent" />
          <p className="text-red-600 text-sm flex items-center relative">
            <svg className="w-5 h-5 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        </div>
      )}

      {/* Title Input */}
      <div className="group/input relative">
        <label 
          htmlFor="title" 
          className={`block text-sm font-medium mb-2 transition-all duration-200 ${
            focused === 'title' ? 'text-blue-600 translate-x-1' : 'text-gray-700'
          }`}
        >
          Bookmark Title
        </label>
        <div className="relative">
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setFocused('title')}
            onBlur={() => setFocused(null)}
            disabled={loading}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl 
              focus:border-blue-500 focus:ring-4 focus:ring-blue-100
              hover:border-blue-300 hover:shadow-md
              disabled:bg-gray-50 disabled:hover:border-gray-200
              transition-all duration-200 outline-none"
            placeholder="e.g., Google, GitHub, Twitter"
          />
          {/* Animated border gradient */}
          <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 -z-10 transition-opacity duration-300 ${focused === 'title' ? 'opacity-100 blur-sm' : ''}`} />
        </div>
        {/* Character count */}
        <div className="absolute right-3 bottom-3 text-xs text-gray-400">
          {title.length}/100
        </div>
      </div>

      {/* URL Input */}
      <div className="group/input relative">
        <label 
          htmlFor="url" 
          className={`block text-sm font-medium mb-2 transition-all duration-200 ${
            focused === 'url' ? 'text-blue-600 translate-x-1' : 'text-gray-700'
          }`}
        >
          URL
        </label>
        <div className="relative">
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setFocused('url')}
            onBlur={() => setFocused(null)}
            disabled={loading}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl 
              focus:border-blue-500 focus:ring-4 focus:ring-blue-100
              hover:border-blue-300 hover:shadow-md
              disabled:bg-gray-50 disabled:hover:border-gray-200
              transition-all duration-200 outline-none"
            placeholder="https://example.com"
          />
          {/* URL validation indicator */}
          {url && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {validateUrl(url) ? (
                <svg className="w-5 h-5 text-green-500 animate-bounce-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !userId}
        className="relative w-full group overflow-hidden rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 group-hover:from-blue-700 group-hover:via-blue-800 group-hover:to-purple-700 transition-all duration-300" />
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        
        {/* Button content */}
        <div className="relative flex items-center justify-center gap-2 py-3.5 px-4">
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-white font-semibold">Adding Bookmark...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-white font-semibold">Add Bookmark</span>
              <span className="absolute right-4 group-hover:translate-x-1 transition-transform">→</span>
            </>
          )}
        </div>

        {/* Ripple effect on click */}
        <span className="absolute inset-0 overflow-hidden rounded-xl">
          <span className="absolute inset-0 bg-white/20 transform scale-0 rounded-full opacity-0 group-active:scale-100 group-active:opacity-100 transition-all duration-500" />
        </span>
      </button>

      {/* Helper text */}
      <p className="text-xs text-center text-gray-400 mt-4">
        Your bookmarks will sync instantly across all your devices
      </p>
    </form>
  );
}