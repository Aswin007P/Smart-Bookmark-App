// URL validation
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// Get user initials
export function getUserInitials(name: string): string {
  const names = name.split(' ')
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

// Copy to clipboard
export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

// Validate bookmark title
export function isValidTitle(title: string): boolean {
  return title.trim().length >= 3 && title.trim().length <= 100
}