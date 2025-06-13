"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface TimeSelectorProps {
  id: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  className?: string
  required?: boolean
}

export default function TimeSelector({
  id,
  name,
  value,
  onChange,
  className = "",
  required = false,
}: TimeSelectorProps) {
  const [hours, setHours] = useState<string[]>([])
  const [minutes, setMinutes] = useState<string[]>([])

  // Générer les options d'heures et de minutes
  useEffect(() => {
    // Heures de 8h à 18h (heures de bureau)
    const hoursArray = Array.from({ length: 11 }, (_, i) => {
      const hour = i + 8
      return hour < 10 ? `0${hour}` : `${hour}`
    })

    // Minutes par tranches de 15 minutes
    const minutesArray = ["00", "15", "30", "45"]

    setHours(hoursArray)
    setMinutes(minutesArray)
  }, [])

  // Extraire l'heure et les minutes de la valeur
  const [selectedHour, selectedMinute] = value ? value.split(":") : ["", ""]

  // Gérer le changement d'heure
  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newHour = e.target.value
    const newValue = `${newHour}:${selectedMinute || "00"}`

    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name,
        value: newValue,
      },
    } as React.ChangeEvent<HTMLSelectElement>

    onChange(syntheticEvent)
  }

  // Gérer le changement de minutes
  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMinute = e.target.value
    const newValue = `${selectedHour || "08"}:${newMinute}`

    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name,
        value: newValue,
      },
    } as React.ChangeEvent<HTMLSelectElement>

    onChange(syntheticEvent)
  }

  return (
    <div className={`flex space-x-2 ${className}`}>
      <div className="w-1/2">
        <select
          id={`${id}-hour`}
          value={selectedHour}
          onChange={handleHourChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          required={required}
        >
          <option value="">Heure</option>
          {hours.map((hour) => (
            <option key={hour} value={hour}>
              {hour}h
            </option>
          ))}
        </select>
      </div>
      <div className="w-1/2">
        <select
          id={`${id}-minute`}
          value={selectedMinute}
          onChange={handleMinuteChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          required={required}
        >
          <option value="">Min</option>
          {minutes.map((minute) => (
            <option key={minute} value={minute}>
              {minute}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
