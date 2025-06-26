import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

// Base skeleton with gradient animation
export const BaseSkeleton = ({ className = "", ...props }) => (
  <Skeleton
    className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse ${className}`}
    {...props}
  />
)

// Page Header Skeleton
export const PageHeaderSkeleton = () => (
  <div className="space-y-4 mb-6 animate-pulse">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="space-y-2">
        <BaseSkeleton className="h-8 w-48" />
        <BaseSkeleton className="h-5 w-80" />
      </div>
      <div className="flex gap-2">
        <BaseSkeleton className="h-10 w-32" />
        <BaseSkeleton className="h-10 w-24" />
      </div>
    </div>
  </div>
)

// Data Table Skeleton
export const DataTableSkeleton = ({ rows = 5, columns = 6 }) => (
  <div className="space-y-4 animate-pulse">
    {/* Table Header */}
    <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg">
      {Array.from({ length: columns }).map((_, i) => (
        <BaseSkeleton key={i} className="h-5 w-full" />
      ))}
    </div>

    {/* Table Rows */}
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-6 gap-4 p-4 bg-white border border-gray-200 rounded-lg">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <BaseSkeleton
              key={colIndex}
              className={`h-4 ${colIndex === columns - 1 ? "w-20" : colIndex === columns - 2 ? "w-16" : "w-full"}`}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
)

// Card Skeleton
export const CardSkeleton = ({ showImage = false, showBadge = false }) => (
  <Card className="animate-pulse">
    {showImage && (
      <div className="aspect-[4/3] bg-gray-200">
        <BaseSkeleton className="w-full h-full" />
      </div>
    )}
    <CardHeader className="space-y-3">
      {showBadge && (
        <div className="flex justify-between items-center">
          <BaseSkeleton className="h-5 w-20" />
          <BaseSkeleton className="h-5 w-16" />
        </div>
      )}
      <BaseSkeleton className="h-6 w-full" />
      <BaseSkeleton className="h-6 w-3/4" />
    </CardHeader>
    <CardContent>
      <BaseSkeleton className="h-4 w-full mb-2" />
      <BaseSkeleton className="h-4 w-2/3" />
    </CardContent>
  </Card>
)

// Form Skeleton
export const FormSkeleton = ({ fields = 4 }) => (
  <div className="space-y-6 animate-pulse">
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i} className="space-y-2">
        <BaseSkeleton className="h-4 w-24" />
        <BaseSkeleton className="h-10 w-full" />
      </div>
    ))}
    <div className="flex gap-2 pt-4">
      <BaseSkeleton className="h-10 w-24" />
      <BaseSkeleton className="h-10 w-32" />
    </div>
  </div>
)

// Button Skeleton
export const ButtonSkeleton = ({ size = "default" }) => {
  const sizeClasses = {
    sm: "h-8 w-20",
    default: "h-10 w-24",
    lg: "h-12 w-32",
  }

  return <BaseSkeleton className={sizeClasses[size]} />
}

// Badge Skeleton
export const BadgeSkeleton = () => <BaseSkeleton className="h-5 w-16 rounded-full" />

// Stats Card Skeleton
export const StatsCardSkeleton = () => (
  <Card className="animate-pulse">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <BaseSkeleton className="h-4 w-20" />
          <BaseSkeleton className="h-8 w-16" />
        </div>
        <BaseSkeleton className="h-8 w-8 rounded" />
      </div>
    </CardContent>
  </Card>
)

// List Item Skeleton
export const ListItemSkeleton = () => (
  <div className="flex items-center space-x-4 p-4 animate-pulse">
    <BaseSkeleton className="h-10 w-10 rounded-full" />
    <div className="space-y-2 flex-1">
      <BaseSkeleton className="h-4 w-full" />
      <BaseSkeleton className="h-3 w-2/3" />
    </div>
    <BaseSkeleton className="h-8 w-20" />
  </div>
)

// Navigation Skeleton
export const NavigationSkeleton = () => (
  <div className="flex items-center space-x-4 animate-pulse">
    {Array.from({ length: 5 }).map((_, i) => (
      <BaseSkeleton key={i} className="h-4 w-16" />
    ))}
  </div>
)

// Pagination Skeleton
export const PaginationSkeleton = () => (
  <div className="flex justify-center items-center space-x-4 animate-pulse">
    <BaseSkeleton className="h-10 w-24" />
    <div className="flex space-x-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <BaseSkeleton key={i} className="h-10 w-10" />
      ))}
    </div>
    <BaseSkeleton className="h-10 w-20" />
  </div>
)

// Hero Section Skeleton
export const HeroSkeleton = ({ withGradient = false }) => (
  <div
    className={`py-16 animate-pulse ${withGradient ? "bg-gradient-to-r from-orange-300 to-green-300" : "bg-gray-100"}`}
  >
    <div className="container mx-auto px-4 text-center space-y-4">
      <BaseSkeleton className={`h-12 w-96 mx-auto ${withGradient ? "bg-white/20" : ""}`} />
      <BaseSkeleton className={`h-6 w-80 mx-auto ${withGradient ? "bg-white/20" : ""}`} />
    </div>
  </div>
)

// Dashboard Grid Skeleton
export const DashboardGridSkeleton = ({ cards = 4 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
    {Array.from({ length: cards }).map((_, i) => (
      <StatsCardSkeleton key={i} />
    ))}
  </div>
)

// Full Page Skeleton
export const FullPageSkeleton = ({ showHero = false, showStats = false, showTable = false, showCards = false }) => (
  <div className="min-h-screen bg-gray-50">
    {showHero && <HeroSkeleton withGradient />}

    <div className="container mx-auto px-4 py-8 space-y-8">
      <PageHeaderSkeleton />

      {showStats && <DashboardGridSkeleton />}

      {showTable && <DataTableSkeleton />}

      {showCards && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} showImage showBadge />
          ))}
        </div>
      )}
    </div>
  </div>
)
