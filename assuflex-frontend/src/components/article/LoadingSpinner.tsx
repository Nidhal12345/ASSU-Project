import type React from "react"

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600">Chargement des articles...</p>
    </div>
  )
}
