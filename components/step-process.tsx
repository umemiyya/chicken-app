'use client'

import { ReactNode } from 'react'
import { CheckCircle2 } from 'lucide-react'

interface Step {
  number: number
  title: string
  description: string
  icon: ReactNode
  isCompleted?: boolean
}

interface StepProcessProps {
  steps: Step[]
  currentStep?: number
}

export function StepProcess({ steps, currentStep = 0 }: StepProcessProps) {
  return (
    <div className="space-y-6">
      {steps.map((step, index) => (
        <div key={step.number} className="flex gap-4">
          {/* Step indicator */}
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                step.isCompleted || index < currentStep
                  ? 'bg-accent text-accent-foreground'
                  : index === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              {step.isCompleted || index < currentStep ? (
                <CheckCircle2 size={24} />
              ) : (
                step.number
              )}
            </div>
            {index < steps.length - 1 && (
              <div className="w-1 h-16 bg-border mt-2" />
            )}
          </div>

          {/* Content */}
          <div className="pb-6 pt-1">
            <h3 className="font-semibold text-lg text-foreground mb-1">
              {step.title}
            </h3>
            <p className="text-muted-foreground text-sm mb-3">
              {step.description}
            </p>
            <div className="text-primary">{step.icon}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
