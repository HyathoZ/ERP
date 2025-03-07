import { cn } from "../../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { motion } from "framer-motion";

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
}

export function DashboardCard({
  title,
  value,
  icon,
  description,
  trend,
  loading,
  className,
  ...props
}: DashboardCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className={cn("overflow-hidden", className)} {...props}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <div className="h-8 w-[100px] animate-pulse rounded-md bg-muted" />
              {description && <div className="h-4 w-[160px] animate-pulse rounded-md bg-muted" />}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">{value}</div>
                {trend && (
                  <span className={cn("text-xs font-medium", trend.isPositive ? "text-green-600" : "text-red-600")}>
                    {trend.isPositive ? "+" : "-"}
                    {Math.abs(trend.value)}%
                  </span>
                )}
              </div>
              {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
