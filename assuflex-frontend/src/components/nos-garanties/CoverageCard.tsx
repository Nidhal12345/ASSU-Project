import type React from "react"
import {
  Stethoscope,
  Building2,
  SmileIcon as Tooth,
  Eye,
  Ear,
  Leaf,
  Shield,
  HelpCircle,
  Baby,
  Globe,
} from "lucide-react"

interface CoverageCardProps {
  title: string
  description: string
  icon: string
  color: string
}

export default function CoverageCard({ title, description, icon, color }: CoverageCardProps) {
  const colorMap: Record<string, { bg: string; text: string; light: string }> = {
    blue: { bg: "bg-blue-600", text: "text-blue-600", light: "bg-blue-50" },
    red: { bg: "bg-red-600", text: "text-red-600", light: "bg-red-50" },
    green: { bg: "bg-green-600", text: "text-green-600", light: "bg-green-50" },
    orange: { bg: "bg-orange-600", text: "text-orange-600", light: "bg-orange-50" },
    purple: { bg: "bg-purple-600", text: "text-purple-600", light: "bg-purple-50" },
    amber: { bg: "bg-amber-600", text: "text-amber-600", light: "bg-amber-50" },
    cyan: { bg: "bg-cyan-600", text: "text-cyan-600", light: "bg-cyan-50" },
    teal: { bg: "bg-teal-600", text: "text-teal-600", light: "bg-teal-50" },
    indigo: { bg: "bg-indigo-600", text: "text-indigo-600", light: "bg-indigo-50" },
    pink: { bg: "bg-pink-600", text: "text-pink-600", light: "bg-pink-50" },
  }

  const colors = colorMap[color] || colorMap.blue

  const iconMap: Record<string, React.ReactNode> = {
    stethoscope: <Stethoscope className="h-6 w-6" />,
    hospital: <Building2 className="h-6 w-6" />,
    tooth: <Tooth className="h-6 w-6" />,
    eye: <Eye className="h-6 w-6" />,
    ear: <Ear className="h-6 w-6" />,
    leaf: <Leaf className="h-6 w-6" />,
    shield: <Shield className="h-6 w-6" />,
    help: <HelpCircle className="h-6 w-6" />,
    baby: <Baby className="h-6 w-6" />,
    globe: <Globe className="h-6 w-6" />,
  }

  return (
    <div className="h-full coverage-card bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
      <div className={`${colors.light} p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4`}>
        <div className={colors.text}>{iconMap[icon] || <Shield className="h-6 w-6" />}</div>
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
