"use client";
import { useState } from "react";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  created_at?: string;
};

export default function BookmarkCard({ 
  bookmark, 
  onDelete,
  viewMode = "grid"
}: { 
  bookmark: Bookmark; 
  onDelete: (id: string) => Promise<void>;
  viewMode?: "grid" | "list";
}) {
  const [deleting, setDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this bookmark?")) return;
    
    setDeleting(true);
    try {
      await onDelete(bookmark.id);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete bookmark");
    } finally {
      setDeleting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(bookmark.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return "example.com";
    }
  };

  const getFaviconUrl = (url: string) => {
    const domain = getDomain(url);
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  };

  const getInitials = (title: string) => {
    return title
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRelativeTime = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // List View
  if (viewMode === "list") {
    return (
      <div
        className="group relative bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        
        <div className="relative p-4 flex items-center gap-4">
          {/* Favicon with ring animation */}
          <div className="relative flex-shrink-0">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center shadow-sm transition-all duration-300 ${isHovered ? 'scale-110 shadow-md' : ''}`}>
              <img 
                src={getFaviconUrl(bookmark.url)}
                alt=""
                className="w-5 h-5"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  target.parentElement?.classList.add('text-blue-600', 'font-bold');
                  target.parentElement!.innerHTML = getInitials(bookmark.title);
                }}
              />
            </div>
            {isHovered && (
              <>
                <div className="absolute -inset-1 bg-blue-400/20 rounded-xl animate-ping" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
              </>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {bookmark.title}
              </h3>
              {bookmark.created_at && (
                <span className="text-xs text-gray-400 flex items-center whitespace-nowrap">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {getRelativeTime(bookmark.created_at)}
                </span>
              )}
            </div>
            <a 
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-blue-600 truncate block transition-colors"
            >
              {getDomain(bookmark.url)}
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <button
              onClick={handleCopy}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-110 relative group/copy"
            >
              {copied ? (
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              )}
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/copy:opacity-100 transition-opacity whitespace-nowrap">
                {copied ? 'Copied!' : 'Copy URL'}
              </span>
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50"
            >
              {deleting ? (
                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div
      className="group relative bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlays */}
      <div className={`absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className={`absolute inset-0 bg-gradient-to-t from-white/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1">
            <div className="relative">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center shadow-sm transition-all duration-300 ${isHovered ? 'scale-110 shadow-md' : ''}`}>
                <img 
                  src={getFaviconUrl(bookmark.url)}
                  alt=""
                  className="w-5 h-5"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    target.parentElement?.classList.add('text-blue-600', 'font-bold');
                    target.parentElement!.innerHTML = getInitials(bookmark.title);
                  }}
                />
              </div>
              {isHovered && (
                <>
                  <div className="absolute -inset-1 bg-blue-400/20 rounded-xl animate-ping" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                </>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {bookmark.title}
              </h3>
              {bookmark.created_at && (
                <span className="text-xs text-gray-400 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {getRelativeTime(bookmark.created_at)}
                </span>
              )}
            </div>
          </div>
          
          {/* Delete button */}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`opacity-0 group-hover:opacity-100 transition-all duration-200 ml-2 p-2 hover:bg-red-50 rounded-lg ${isHovered ? 'scale-100' : 'scale-90'}`}
          >
            {deleting ? (
              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>

        {/* URL */}
        <div className="mb-4 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <a 
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-blue-600 truncate block transition-colors"
          >
            {bookmark.url}
          </a>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <span className="relative">
                Visit
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover/btn:w-full transition-all duration-300" />
              </span>
              <svg className="w-4 h-4 ml-1 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
              {getDomain(bookmark.url)}
            </span>
            
            <button
              onClick={handleCopy}
              className="relative group/copy p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-110"
            >
              {copied ? (
                <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              )}
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/copy:opacity-100 transition-opacity whitespace-nowrap">
                {copied ? 'Copied!' : 'Copy URL'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}