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
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filter and sort bookmarks
  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookmark.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedBookmarks = [...filteredBookmarks].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  // Handle realtime updates
  useEffect(() => {
    if (!userId) return;

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
          setBookmarks(prev => prev.filter(b => b.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete bookmark");
    } finally {
      setLoading(false);
    }
  };

  // Loading skeleton
  if (loading && bookmarks.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                <div className="h-5 bg-gray-200 rounded flex-1"></div>
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
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

  // Empty state
  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200">
        <div className="max-w-md mx-auto">
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-full flex items-center justify-center animate-float">
              <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-2xl">✨</span>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Your collection is empty</h3>
          <p className="text-gray-500 mb-8">
            Start saving your favorite websites. They'll appear here and sync across all your devices.
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
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left controls */}
          <div className="flex items-center gap-4">
            {/* View toggle */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "grid" 
                    ? "bg-white text-blue-600 shadow-md scale-105" 
                    : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                }`}
                title="Grid view"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "list" 
                    ? "bg-white text-blue-600 shadow-md scale-105" 
                    : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                }`}
                title="List view"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 
                hover:border-blue-400 hover:shadow-md hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                cursor-pointer transition-all duration-200"
            >
              <option value="newest">✨ Newest first</option>
              <option value="oldest">📅 Oldest first</option>
              <option value="title">📝 By title</option>
            </select>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search bookmarks..."
              className="w-full px-4 py-2 pl-10 bg-white border border-gray-200 rounded-lg 
                focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                hover:border-blue-300 hover:shadow-md
                transition-all duration-200 outline-none"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-2 text-sm bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-lg">
            <span className="text-gray-600">Total:</span>
            <span className="font-bold text-blue-600 bg-white px-2.5 py-0.5 rounded-full shadow-sm">
              {sortedBookmarks.length}
            </span>
          </div>
        </div>
      </div>

      {/* Bookmarks grid/list */}
      {sortedBookmarks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">No bookmarks match your search</p>
        </div>
      ) : (
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
      )}

      {/* Scroll to top button */}
      {bookmarks.length > 6 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg 
            hover:shadow-xl hover:scale-110 hover:rotate-12
            active:scale-95 active:rotate-0
            focus:outline-none focus:ring-4 focus:ring-blue-500/50
            transition-all duration-300 group/scroll z-10"
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