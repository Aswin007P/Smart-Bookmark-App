"use client";
import BookmarkCard from "./BookmarkCard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/browser";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  user_id: string;
  created_at?: string;
};

export default function BookmarkList({ 
  initialBookmarks 
}: { 
  initialBookmarks: Bookmark[] 
}) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
        }
      } catch (error) {
        console.error("Error getting user:", error);
      }
    };
    getCurrentUser();
  }, []);

  // Sort bookmarks based on selected sort option
  const sortedBookmarks = [...bookmarks].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  // Handle realtime updates - only for this user
  useEffect(() => {
    if (!userId) return;

    console.log("🔵 Setting up realtime subscription for user:", userId);

    const channel = supabase
      .channel(`bookmarks-${userId}`)
      .on(
        "postgres_changes",
        { 
          event: "INSERT", 
          schema: "public", 
          table: "bookmarks",
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log("🔵 Realtime INSERT received:", payload.new);
          setBookmarks(prev => {
            if (prev.some(b => b.id === payload.new.id)) return prev;
            return [payload.new as Bookmark, ...prev];
          });
        }
      )
      .on(
        "postgres_changes",
        { 
          event: "DELETE", 
          schema: "public", 
          table: "bookmarks",
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log("🔵 Realtime DELETE received:", payload.old);
          setBookmarks(prev => prev.filter(b => b.id !== payload.old.id));
        }
      )
      .on(
        "postgres_changes",
        { 
          event: "UPDATE", 
          schema: "public", 
          table: "bookmarks",
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log("🔵 Realtime UPDATE received:", payload.new);
          setBookmarks(prev => 
            prev.map(b => b.id === payload.new.id ? payload.new as Bookmark : b)
          );
        }
      )
      .subscribe((status) => {
        console.log("🔵 Realtime subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Handle delete bookmark
  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Delete error:", error);
        alert("Failed to delete bookmark");
        return;
      }

      setBookmarks(prev => prev.filter(b => b.id !== id));
      
    } catch (error) {
      console.error("Unexpected delete error:", error);
      alert("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Debug logging
  console.log("🟢 BookmarkList render:", { 
    userId, 
    bookmarksCount: bookmarks.length,
    initialCount: initialBookmarks.length 
  });

  // Loading skeleton
  if (loading && bookmarks.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                <div className="h-5 bg-gray-200 rounded flex-1"></div>
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
            </div>
            <div className="mb-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state with beautiful illustration
  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="max-w-md mx-auto">
          {/* Animated illustration */}
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-2xl">✨</span>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Your bookmark collection is empty</h3>
          <p className="text-gray-500 mb-8">
            Start saving your favorite websites, articles, and resources. 
            They'll appear here and sync across all your devices.
          </p>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">💡</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700 mb-1">Pro tip:</p>
                <p className="text-sm text-gray-500">
                  Click the "Add New Bookmark" button above to save your first link. 
                  You can organize them with titles and they'll update in real-time!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render bookmarks with view controls
  return (
    <div>
      {/* View controls and stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-all duration-200 
                ${viewMode === "grid" 
                  ? "bg-blue-50 text-blue-600 shadow-sm scale-105" 
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50 hover:scale-105"
                }
                active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
              `}
              title="Grid view"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-all duration-200
                ${viewMode === "list" 
                  ? "bg-blue-50 text-blue-600 shadow-sm scale-105" 
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50 hover:scale-105"
                }
                active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
              `}
              title="List view"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 
              hover:border-blue-400 hover:shadow-sm hover:scale-105
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              cursor-pointer transition-all duration-200"
          >
            <option value="newest">✨ Newest first</option>
            <option value="oldest">📅 Oldest first</option>
            <option value="title">📝 By title</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-500">Total:</span>
          <span className="font-semibold text-gray-900 bg-blue-50 px-2.5 py-0.5 rounded-full">
            {bookmarks.length} {bookmarks.length === 1 ? 'bookmark' : 'bookmarks'}
          </span>
        </div>
      </div>

      {/* Bookmarks grid/list */}
      <div className={
        viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          : "space-y-3"
      }>
        {sortedBookmarks.map((bookmark, index) => (
          <div
            key={bookmark.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <BookmarkCard 
              bookmark={bookmark} 
              onDelete={handleDelete}
              viewMode={viewMode}
            />
          </div>
        ))}
      </div>

      {/* Scroll to top button (appears when many bookmarks) */}
      {bookmarks.length > 6 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg 
            hover:bg-blue-700 hover:scale-110 hover:shadow-xl
            active:scale-95 active:bg-blue-800
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            transition-all duration-200 group/scroll z-10"
          title="Scroll to top"
        >
          <svg className="w-5 h-5 group-hover/scroll:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
}