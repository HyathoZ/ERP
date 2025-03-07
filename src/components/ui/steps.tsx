import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: {
    title: string;
    description?: string;
  }[];
  currentStep: number;
}

export function Steps({ steps, currentStep, className, ...props }: StepsProps) {
  return (
    <div className={cn("relative space-y-4 pb-8", className)} {...props}>
      {/* Linha de conexão */}
      <div className="absolute left-0 top-2 h-full w-[2px] bg-gray-200" />

      {/* Passos */}
      <div className="relative space-y-8">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index + 1;
          const isCurrent = currentStep === index + 1;

          return (
            <div key={step.title} className="relative pl-8">
              {/* Indicador do passo */}
              <div
                className={cn(
                  "absolute left-0 top-2 z-10 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border-2",
                  isCompleted
                    ? "border-blue-600 bg-blue-600"
                    : isCurrent
                    ? "border-blue-600 bg-white"
                    : "border-gray-300 bg-white"
                )}
              >
                {isCompleted ? (
                  <Check className="h-2.5 w-2.5 text-white" />
                ) : (
                  <div className={cn("h-1.5 w-1.5 rounded-full", isCurrent ? "bg-blue-600" : "bg-gray-300")} />
                )}
              </div>

              {/* Conteúdo do passo */}
              <div className="space-y-1">
                <div
                  className={cn("text-sm font-medium", isCompleted || isCurrent ? "text-gray-900" : "text-gray-500")}
                >
                  {step.title}
                </div>
                {step.description && (
                  <div className={cn("text-sm", isCompleted || isCurrent ? "text-gray-600" : "text-gray-400")}>
                    {step.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
