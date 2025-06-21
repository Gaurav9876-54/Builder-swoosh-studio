import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatar?: string;
  isOnline: boolean;
  screenTimeToday: string;
  alertsCount: number;
}

interface ChildProfileCardProps {
  child: ChildProfile;
  onClick?: () => void;
}

export const ChildProfileCard = ({ child, onClick }: ChildProfileCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-all duration-200 active:scale-[0.98]"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage src={child.avatar} alt={child.name} />
              <AvatarFallback className="bg-safe-100 text-safe-700 font-semibold">
                {getInitials(child.name)}
              </AvatarFallback>
            </Avatar>
            <Circle
              className={cn(
                "absolute -bottom-1 -right-1 h-4 w-4 border-2 border-white rounded-full",
                child.isOnline
                  ? "text-success-500 fill-success-500"
                  : "text-muted fill-muted",
              )}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground truncate">
                {child.name}
              </h3>
              <span className="text-sm text-muted-foreground">
                {child.age}y
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <div className="text-sm text-muted-foreground">
                Screen time: {child.screenTimeToday}
              </div>
              {child.alertsCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {child.alertsCount} alert{child.alertsCount > 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
