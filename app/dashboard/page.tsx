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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse-slow animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-100/10 to-purple-100/10 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      {/* Header with glass morphism */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo with animation */}
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-300">
                  <span className="text-white font-bold text-xl">B</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <div className="animate-slide-right">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Smart Bookmarks
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block animate-fade-in">
                  Organize your favorite links
                </p>
              </div>
            </div>

            {/* User section */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 group">
                <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-medium text-sm">
                        {getUserInitials(user.email || "")}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block group-hover:text-blue-600 transition-colors">
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
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
        {/* Animated notifications */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50/90 backdrop-blur-sm border border-green-200 rounded-xl animate-slide-down shadow-lg">
            <p className="text-green-600 text-sm flex items-center">
              <svg className="w-5 h-5 mr-2 animate-bounce-check" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {successMessage}
            </p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-xl animate-shake shadow-lg">
            <p className="text-red-600 text-sm flex items-center">
              <svg className="w-5 h-5 mr-2 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {errorMessage}
            </p>
          </div>
        )}

        {/* Stats Cards with hover animations */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            {
              title: "Total Bookmarks",
              value: bookmarks?.length || 0,
              icon: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z",
              color: "blue",
              delay: "0ms"
            },
            {
              title: "Account",
              value: user.email,
              icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
              color: "green",
              delay: "100ms"
            },
            {
              title: "Member Since",
              value: new Date(user.created_at || Date.now()).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
              }),
              icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
              color: "purple",
              delay: "200ms"
            }
          ].map((card, index) => (
            <div
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50 
                hover:shadow-2xl hover:scale-105 hover:-translate-y-1
                transition-all duration-500 animate-slide-up"
              style={{ animationDelay: card.delay }}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br from-${card.color}-600/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative flex items-center justify-between">
                <div>
                  <p className={`text-sm text-gray-500 mb-1 group-hover:text-${card.color}-600 transition-colors duration-300`}>
                    {card.title}
                  </p>
                  <p className={`text-2xl font-bold text-gray-900 group-hover:text-${card.color}-600 transition-colors duration-300 truncate max-w-[180px]`}>
                    {card.value}
                  </p>
                </div>
                
                {/* Animated icon container */}
                <div className={`relative`}>
                  <div className={`w-14 h-14 bg-${card.color}-100 rounded-xl flex items-center justify-center 
                    group-hover:bg-${card.color}-200 group-hover:scale-110 group-hover:rotate-6
                    transition-all duration-300 shadow-md`}>
                    <svg className={`w-7 h-7 text-${card.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                    </svg>
                  </div>
                  
                  {/* Orbiting dot */}
                  <div className={`absolute -inset-1 border-2 border-${card.color}-200 rounded-xl opacity-0 group-hover:opacity-100 animate-spin-slow`}></div>
                </div>
              </div>
              
              {/* Shine effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full" 
                style={{ backgroundSize: '200% 100%' }} />
            </div>
          ))}
        </div>

        {/* Add Bookmark Section with glass morphism */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="relative group">
            {/* Background blur effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
            
            <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              {/* Animated header */}
              <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 px-6 py-5 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <div className="relative flex items-center">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm mr-3 animate-float">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      Add New Bookmark
                    </h2>
                    <p className="text-blue-100 text-sm">
                      Save your favorite websites for quick access
                    </p>
                  </div>
                </div>
                
                {/* Decorative circles */}
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/10 rounded-full blur-2xl"></div>
              </div>
              
              <div className="p-6">
                <BookmarkForm />
              </div>
            </div>
          </div>
        </div>

        {/* Bookmarks Grid with header */}
        <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="group">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="relative">
                  <svg className="w-6 h-6 mr-2 text-blue-600 inline-block transform group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Your Bookmarks
                </span>
                <span className="ml-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium px-3 py-1 rounded-full shadow-md group-hover:shadow-lg transform group-hover:scale-110 transition-all duration-300">
                  {bookmarks?.length || 0}
                </span>
              </h2>
              <p className="text-sm text-gray-500 mt-1 flex items-center">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Your bookmarks sync in real-time across all devices
              </p>
            </div>
          </div>
          
          <BookmarkList initialBookmarks={bookmarks || []} />
        </div>
      </main>

      {/* Footer with animation */}
      <footer className="relative mt-12 py-6 border-t border-gray-200/50 backdrop-blur-sm bg-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 animate-pulse-slow">
            Smart Bookmark App © {new Date().getFullYear()} - Securely manage your bookmarks
          </p>
        </div>
      </footer>
    </div>
  );
}