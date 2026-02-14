import BookmarkForm from "@/components/bookmarks/BookmarkForm";
import BookmarkList from "@/components/bookmarks/BookmarkList";
import LogoutButton from "@/components/auth/LogoutButton";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  console.log("🟢 Dashboard page loading");
  
  const params = await searchParams;
  
  const cookieStore = await cookies();
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    console.log("🟡 No user found, redirecting to login");
    redirect("/login");
  }
  
  const { data: bookmarks, error: bookmarksError } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (bookmarksError) {
    console.error("🔴 Error fetching bookmarks:", bookmarksError);
  }

  const errorMessage = params.error === "missing_fields" 
    ? "Please fill in all fields"
    : params.error === "create_failed"
    ? "Failed to create bookmark"
    : params.error === "server_error"
    ? "Server error, please try again"
    : null;

  const successMessage = params.success === "bookmark_added"
    ? "Bookmark added successfully!"
    : params.success === "bookmark_deleted"
    ? "Bookmark deleted successfully!"
    : null;

  const getUserInitials = (email: string) => {
    return email?.charAt(0).toUpperCase() || "U";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 backdrop-blur-lg bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Smart Bookmarks
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Organize your favorite links
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white font-medium text-sm">
                      {getUserInitials(user.email || "")}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {user.email?.split('@')[0]}
                  </span>
                </div>
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
            <p className="text-green-600 text-sm flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {successMessage}
            </p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
            <p className="text-red-600 text-sm flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {errorMessage}
            </p>
          </div>
        )}

        {/* Stats Cards - Enhanced with hover effects */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 
            hover:shadow-md hover:border-blue-200 hover:scale-105
            transition-all duration-200 group/card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1 group-hover/card:text-blue-600 transition-colors">
                  Total Bookmarks
                </p>
                <p className="text-3xl font-bold text-gray-900 group-hover/card:text-blue-600 transition-colors">
                  {bookmarks?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover/card:bg-blue-200 group-hover/card:scale-110 transition-all duration-200">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 
            hover:shadow-md hover:border-green-200 hover:scale-105
            transition-all duration-200 group/card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1 group-hover/card:text-green-600 transition-colors">
                  Account
                </p>
                <p className="text-sm font-medium text-gray-900 truncate max-w-[150px] group-hover/card:text-green-600 transition-colors">
                  {user.email}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover/card:bg-green-200 group-hover/card:scale-110 transition-all duration-200">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 
            hover:shadow-md hover:border-purple-200 hover:scale-105
            transition-all duration-200 group/card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1 group-hover/card:text-purple-600 transition-colors">
                  Member Since
                </p>
                <p className="text-sm font-medium text-gray-900 group-hover/card:text-purple-600 transition-colors">
                  {new Date(user.created_at || Date.now()).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover/card:bg-purple-200 group-hover/card:scale-110 transition-all duration-200">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Add Bookmark Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden
            hover:shadow-xl transition-shadow duration-200">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Bookmark
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                Save your favorite websites for quick access
              </p>
            </div>
            <div className="p-6">
              <BookmarkForm />
            </div>
          </div>
        </div>

        {/* Bookmarks Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Your Bookmarks
                <span className="ml-3 bg-blue-100 text-blue-600 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {bookmarks?.length || 0}
                </span>
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Your bookmarks sync in real-time across all devices
              </p>
            </div>
          </div>
          
          <BookmarkList initialBookmarks={bookmarks || []} />
        </div>
      </main>

      <footer className="mt-12 py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Smart Bookmark App © {new Date().getFullYear()} - Securely manage your bookmarks
          </p>
        </div>
      </footer>
    </div>
  );
}