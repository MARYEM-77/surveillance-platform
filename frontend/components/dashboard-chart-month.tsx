"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"

export function DashboardChartMonth() {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/alerts/by-day-of-month/")
        const json = await res.json()
        setData(json)
      } catch (error) {
        console.error("Erreur lors de la récupération des données par jour du mois :", error)
      }
    }

    fetchData()
  }, [])

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip />
        <Bar dataKey="feu" fill="#f43f5e" radius={[4, 4, 0, 0]} />
        <Bar dataKey="arme" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        <Bar dataKey="criminel" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
