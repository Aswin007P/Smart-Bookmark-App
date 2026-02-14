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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-shake">
          <p className="text-red-600 text-sm flex items-center">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        </div>
      )}

      <div className="group/input">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 group-focus-within/input:text-blue-600 transition-colors">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg 
            focus:ring-2 focus:ring-blue-500 focus:border-transparent 
            hover:border-blue-400 hover:shadow-sm
            disabled:bg-gray-50 disabled:hover:border-gray-300
            transition-all duration-200"
          placeholder="Google"
          autoFocus
        />
      </div>

      <div className="group/input">
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1 group-focus-within/input:text-blue-600 transition-colors">
          URL
        </label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg 
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            hover:border-blue-400 hover:shadow-sm
            disabled:bg-gray-50 disabled:hover:border-gray-300
            transition-all duration-200"
          placeholder="https://google.com"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !userId}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 px-4 rounded-lg font-medium shadow-sm 
          hover:from-blue-700 hover:to-blue-800 hover:shadow-md hover:scale-[1.02]
          active:from-blue-800 active:to-blue-900 active:scale-[0.98]
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:opacity-50 disabled:hover:scale-100 disabled:hover:from-blue-600 disabled:hover:to-blue-700
          transition-all duration-200 group"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Adding...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Bookmark
          </span>
        )}
      </button>
    </form>
  );
}