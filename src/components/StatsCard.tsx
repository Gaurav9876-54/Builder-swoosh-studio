import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "warning" | "success" | "danger";
  className?: string;
}

export const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
  className,
}: StatsCardProps) => {
  const variantStyles = {
    default: {
      card: "border-safe-200",
      icon: "text-safe-500 bg-safe-50",
      value: "text-safe-700",
    },
    success: {
      card: "border-success-200",
      icon: "text-success-600 bg-success-50",
      value: "text-success-700",
    },
    warning: {
      card: "border-warning-200",
      icon: "text-warning-600 bg-warning-50",
      value: "text-warning-700",
    },
    danger: {
      card: "border-destructive",
      icon: "text-destructive bg-destructive/10",
      value: "text-destructive",
    },
  };

  const styles = variantStyles[variant];

  return (
    <Card className={cn("border", styles.card, className)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg", styles.icon)}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-muted-foreground">
              {title}
            </div>
            <div className={cn("text-2xl font-bold", styles.value)}>
              {value}
            </div>
            {subtitle && (
              <div className="text-sm text-muted-foreground mt-1">
                {subtitle}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
