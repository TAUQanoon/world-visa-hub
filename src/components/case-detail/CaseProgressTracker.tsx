import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkflowStage {
  name: string;
  description?: string;
  duration?: string;
}

interface CaseProgressTrackerProps {
  workflowStages: WorkflowStage[];
  currentStage?: string | null;
}

export function CaseProgressTracker({
  workflowStages,
  currentStage,
}: CaseProgressTrackerProps) {
  if (!workflowStages || workflowStages.length === 0) {
    return null;
  }

  const currentStageIndex = currentStage
    ? workflowStages.findIndex((stage) => stage.name === currentStage)
    : -1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Desktop: Horizontal layout */}
          <div className="hidden md:flex items-start justify-between">
            {workflowStages.map((stage, index) => {
              const isCompleted = currentStageIndex > index;
              const isCurrent = currentStageIndex === index;
              const isFuture = currentStageIndex < index;

              return (
                <div key={index} className="flex flex-col items-center flex-1 relative">
                  {/* Connecting line */}
                  {index < workflowStages.length - 1 && (
                    <div
                      className={cn(
                        "absolute top-5 left-1/2 w-full h-0.5",
                        isCompleted ? "bg-primary" : "bg-muted"
                      )}
                    />
                  )}

                  {/* Stage indicator */}
                  <div
                    className={cn(
                      "relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                      isCompleted && "bg-primary border-primary",
                      isCurrent && "bg-primary border-primary animate-pulse",
                      isFuture && "bg-background border-muted"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                    ) : isCurrent ? (
                      <Clock className="h-5 w-5 text-primary-foreground" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Stage name */}
                  <div className="mt-2 text-center max-w-[120px]">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        (isCompleted || isCurrent) && "text-foreground",
                        isFuture && "text-muted-foreground"
                      )}
                    >
                      {stage.name}
                    </p>
                    {stage.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {stage.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile: Vertical layout */}
          <div className="md:hidden space-y-4">
            {workflowStages.map((stage, index) => {
              const isCompleted = currentStageIndex > index;
              const isCurrent = currentStageIndex === index;
              const isFuture = currentStageIndex < index;

              return (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    {/* Stage indicator */}
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all",
                        isCompleted && "bg-primary border-primary",
                        isCurrent && "bg-primary border-primary animate-pulse",
                        isFuture && "bg-background border-muted"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                      ) : isCurrent ? (
                        <Clock className="h-4 w-4 text-primary-foreground" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    {/* Connecting line */}
                    {index < workflowStages.length - 1 && (
                      <div
                        className={cn(
                          "w-0.5 h-12 mt-1",
                          isCompleted ? "bg-primary" : "bg-muted"
                        )}
                      />
                    )}
                  </div>

                  {/* Stage info */}
                  <div className="flex-1 pb-4">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        (isCompleted || isCurrent) && "text-foreground",
                        isFuture && "text-muted-foreground"
                      )}
                    >
                      {stage.name}
                    </p>
                    {stage.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {stage.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
