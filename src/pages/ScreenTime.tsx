import { MobileNav, SOSButton } from "@/components/ui/mobile-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, Smartphone, Tv } from "lucide-react";
import { Link } from "react-router-dom";

const mockScreenTimeData = [
  {
    child: "Emma Johnson",
    todayUsage: "3h 45m",
    dailyLimit: "4h 0m",
    percentage: 94,
    devices: [
      { name: "iPhone", usage: "2h 15m" },
      { name: "iPad", usage: "1h 30m" },
    ],
  },
  {
    child: "Lucas Johnson",
    todayUsage: "1h 20m",
    dailyLimit: "2h 0m",
    percentage: 67,
    devices: [
      { name: "Android Tablet", usage: "1h 5m" },
      { name: "Smart TV", usage: "15m" },
    ],
  },
];

const ScreenTime = () => {
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
            <h1 className="text-lg font-semibold">Screen Time</h1>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-4">
        {mockScreenTimeData.map((child, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                {child.child}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Today's usage
                  </span>
                  <span className="text-sm font-medium">
                    {child.todayUsage} / {child.dailyLimit}
                  </span>
                </div>
                <Progress value={child.percentage} className="h-2" />
                {child.percentage > 90 && (
                  <p className="text-xs text-warning-600 mt-1">
                    Close to daily limit
                  </p>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Device Breakdown
                </h4>
                <div className="space-y-2">
                  {child.devices.map((device, deviceIndex) => (
                    <div
                      key={deviceIndex}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground flex items-center gap-2">
                        {device.name.includes("TV") ? (
                          <Tv className="h-3 w-3" />
                        ) : (
                          <Smartphone className="h-3 w-3" />
                        )}
                        {device.name}
                      </span>
                      <span className="font-medium">{device.usage}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-safe-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Manage Screen Time</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Set daily limits, schedule device-free times, and create healthy
              digital habits for your family.
            </p>
            <Button className="w-full">Configure Limits</Button>
          </CardContent>
        </Card>
      </main>

      <MobileNav />
      <SOSButton />
    </div>
  );
};

export default ScreenTime;
