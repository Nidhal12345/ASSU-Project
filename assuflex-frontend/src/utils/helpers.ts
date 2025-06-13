export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Date invalide"
    }

    // French date formatting
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }

    return new Intl.DateTimeFormat("fr-FR", options).format(date)
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Date invalide"
  }
}

export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return ""
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + "..."
}

export const stripHtml = (html: string): string => {
  if (!html) return ""
  try {
    const tmp = document.createElement("div")
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ""
  } catch (error) {
    console.error("Error stripping HTML:", error)
    return html
  }
}

export const formatReadingTime = (content: string): string => {
  if (!content) return "0 min de lecture"

  try {
    const wordsPerMinute = 200
    const words = stripHtml(content)
      .split(/\s+/)
      .filter((word) => word.length > 0).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min de lecture`
  } catch (error) {
    console.error("Error calculating reading time:", error)
    return "0 min de lecture"
  }
}
