'use client'

import { ReactNode } from 'react'

interface StatCardProps {
  icon: ReactNode
  title: string
  value: string | number
  subtitle?: string
}

export function StatCard({ icon, title, value, subtitle }: StatCardProps) {
  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-2">{title}</p>
          <p className="text-3xl font-bold text-primary">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className="text-accent bg-accent/10 p-3 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  )
}
