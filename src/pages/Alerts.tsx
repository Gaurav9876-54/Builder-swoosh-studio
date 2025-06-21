import { MobileNav, SOSButton } from "@/components/ui/mobile-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowLeft, Bell, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const mockAlerts = [
  {
    id: "1",
    type: "content",
    title: "Inappropriate Content Blocked",
    child: "Lucas Johnson",
    time: "2 minutes ago",
    severity: "medium",
    description: "Blocked access to inappropriate website",
  },
  {
    id: "2",
    type: "time",
    title: "Screen Time Limit Exceeded",
    child: "Lucas Johnson",
    time: "15 minutes ago",
    severity: "low",
    description: "Daily screen time limit of 2 hours reached",
  },
];

const Alerts = () => {
  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-white border-b border-border px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Alerts</h1>
          </div>
          <Badge variant="destructive" className="text-xs">
            {mockAlerts.length} active
          </Badge>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-4">
        {mockAlerts.length > 0 ? (
          mockAlerts.map((alert) => (
            <Card key={alert.id} className="border-l-4 border-l-warning-400">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-warning-50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-warning-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground text-sm">
                        {alert.title}
                      </h3>
                      <Badge variant={getSeverityVariant(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {alert.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {alert.time}
                      </span>
                      <span>Child: {alert.child}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">
                No Active Alerts
              </h3>
              <p className="text-muted-foreground text-sm">
                Great! Your children's online activity is looking safe. You'll
                be notified here if anything needs your attention.
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <MobileNav />
      <SOSButton />
    </div>
  );
};

export default Alerts;
