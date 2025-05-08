"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"

const data = [
  {
    name: "00:00",
    feu: 0,
    arme: 0,
    visage: 1,
  },
  {
    name: "02:00",
    feu: 0,
    arme: 0,
    visage: 2,
  },
  {
    name: "04:00",
    feu: 1,
    arme: 0,
    visage: 0,
  },
  {
    name: "06:00",
    feu: 0,
    arme: 0,
    visage: 1,
  },
  {
    name: "08:00",
    feu: 1,
    arme: 0,
    visage: 2,
  },
  {
    name: "10:00",
    feu: 2,
    arme: 1,
    visage: 3,
  },
  {
    name: "12:00",
    feu: 1,
    arme: 1,
    visage: 2,
  },
  {
    name: "14:00",
    feu: 0,
    arme: 0,
    visage: 1,
  },
  {
    name: "16:00",
    feu: 1,
    arme: 1,
    visage: 0,
  },
  {
    name: "18:00",
    feu: 1,
    arme: 0,
    visage: 1,
  },
  {
    name: "20:00",
    feu: 0,
    arme: 0,
    visage: 1,
  },
  {
    name: "22:00",
    feu: 0,
    arme: 0,
    visage: 0,
  },
]

export function DashboardChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="feu" fill="#f43f5e" radius={[4, 4, 0, 0]} />
        <Bar dataKey="arme" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        <Bar dataKey="visage" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
