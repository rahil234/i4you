interface OnboardingProgressProps {
  step: number
  totalSteps: number
}

export function OnboardingProgress({ step, totalSteps }: OnboardingProgressProps) {
  return (
    <div className="w-full py-4 px-4 border-b">
      <div className="w-full max-w-md mx-auto">
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className={`h-1 flex-1 rounded-full ${index < step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          Step {step} of {totalSteps}
        </div>
      </div>
    </div>
  )
}

