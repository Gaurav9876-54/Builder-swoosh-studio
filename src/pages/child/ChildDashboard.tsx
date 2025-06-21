import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useChildAuth } from "@/contexts/ChildAuthContext";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Home,
  Clock,
  Star,
  Trophy,
  Gamepad2,
  BookOpen,
  Heart,
  Shield,
  Settings,
  LogOut,
  Sun,
  Moon,
  Zap,
  Target,
  Award,
  CheckCircle,
  AlertCircle,
  Timer,
  Smartphone,
  MapPin,
  Users,
  Camera,
  Music,
  Palette,
  Code,
  Calculator,
} from "lucide-react";

// Mock child data - would come from auth context in real app
const getCurrentChild = (children: any[], userId: string) => {
  // For demo, return first child or create a sample child
  return (
    children[0] || {
      id: "child-demo",
      firstName: "Alex",
      lastName: "Student",
      age: 10,
      avatar: "",
      screenTime: {
        today: 120, // 2 hours
        dailyAverage: 150,
        thisWeek: 840,
      },
      settings: {
        screenTime: {
          dailyLimit: 180, // 3 hours
          bedtime: "20:00",
          wakeupTime: "07:00",
        },
      },
      achievements: [
        {
          id: 1,
          name: "Study Star",
          icon: Star,
          earned: true,
          description: "Completed 5 educational activities",
        },
        {
          id: 2,
          name: "Time Master",
          icon: Clock,
          earned: true,
          description: "Stayed within screen time for a week",
        },
        {
          id: 3,
          name: "Explorer",
          icon: Target,
          earned: false,
          description: "Try 10 new educational apps",
        },
        {
          id: 4,
          name: "Helper",
          icon: Heart,
          earned: true,
          description: "Asked for help when needed",
        },
      ],
      activities: [
        {
          name: "Khan Academy Kids",
          time: 45,
          category: "educational",
          icon: BookOpen,
          color: "bg-green-100 text-green-700",
        },
        {
          name: "Scratch Jr",
          time: 30,
          category: "creative",
          icon: Code,
          color: "bg-purple-100 text-purple-700",
        },
        {
          name: "Math Games",
          time: 25,
          category: "educational",
          icon: Calculator,
          color: "bg-blue-100 text-blue-700",
        },
        {
          name: "Drawing App",
          time: 20,
          category: "creative",
          icon: Palette,
          color: "bg-pink-100 text-pink-700",
        },
      ],
      rewards: {
        points: 850,
        level: 3,
        nextLevelPoints: 1000,
        weeklyGoal: 500,
        weeklyProgress: 350,
      },
    }
  );
};

const ChildDashboard = () => {
  const { state: parentState } = useAuth();
  const { state: childState, logout, requestHelp } = useChildAuth();
  const { getChildScreenTime } = useRealTimeData();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTimeWarning, setShowTimeWarning] = useState(false);

  // Get current child data - prefer child auth data, fallback to mock data
  const currentChild = childState.user
    ? {
        id: childState.user.id,
        firstName: childState.user.firstName,
        lastName: childState.user.lastName,
        age: childState.user.age,
        avatar: childState.user.avatar,
        screenTime: {
          today: childState.screenTimeToday,
          dailyAverage: 150,
          thisWeek: 840,
        },
        settings: {
          screenTime: {
            dailyLimit: 180, // 3 hours
            bedtime: "20:00",
            wakeupTime: "07:00",
          },
        },
        achievements: [
          {
            id: 1,
            name: "Study Star",
            icon: Star,
            earned: true,
            description: "Completed 5 educational activities",
          },
          {
            id: 2,
            name: "Time Master",
            icon: Clock,
            earned: true,
            description: "Stayed within screen time for a week",
          },
          {
            id: 3,
            name: "Explorer",
            icon: Target,
            earned: false,
            description: "Try 10 new educational apps",
          },
          {
            id: 4,
            name: "Helper",
            icon: Heart,
            earned: true,
            description: "Asked for help when needed",
          },
        ],
        activities: [
          {
            name: "Khan Academy Kids",
            time: 45,
            category: "educational",
            icon: BookOpen,
            color: "bg-green-100 text-green-700",
          },
          {
            name: "Scratch Jr",
            time: 30,
            category: "creative",
            icon: Code,
            color: "bg-purple-100 text-purple-700",
          },
          {
            name: "Math Games",
            time: 25,
            category: "educational",
            icon: Calculator,
            color: "bg-blue-100 text-blue-700",
          },
          {
            name: "Drawing App",
            time: 20,
            category: "creative",
            icon: Palette,
            color: "bg-pink-100 text-pink-700",
          },
        ],
        rewards: {
          points: 850,
          level: 3,
          nextLevelPoints: 1000,
          weeklyGoal: 500,
          weeklyProgress: 350,
        },
      }
    : getCurrentChild(parentState.children, parentState.user?.id || "");

  const realTimeData = getChildScreenTime(currentChild.id);

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Check for time warnings
  useEffect(() => {
    const timeUsed =
      realTimeData?.currentUsage || currentChild.screenTime.today;
    const timeLimit = currentChild.settings.screenTime.dailyLimit;
    const timeRemaining = timeLimit - timeUsed;

    if (timeRemaining <= 30 && timeRemaining > 0) {
      setShowTimeWarning(true);
    } else {
      setShowTimeWarning(false);
    }
  }, [realTimeData, currentChild]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getTimeRemaining = () => {
    const timeUsed =
      realTimeData?.currentUsage || currentChild.screenTime.today;
    const timeLimit = currentChild.settings.screenTime.dailyLimit;
    return Math.max(0, timeLimit - timeUsed);
  };

  const getProgressPercentage = () => {
    const timeUsed =
      realTimeData?.currentUsage || currentChild.screenTime.today;
    const timeLimit = currentChild.settings.screenTime.dailyLimit;
    return (timeUsed / timeLimit) * 100;
  };

  const isWithinAllowedHours = () => {
    const now = currentTime;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeString = `${currentHour.toString().padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

    const bedtime = currentChild.settings.screenTime.bedtime;
    const wakeupTime = currentChild.settings.screenTime.wakeupTime;

    return currentTimeString >= wakeupTime && currentTimeString <= bedtime;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-4">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 bg-white rounded-2xl p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-4 border-purple-200">
            <AvatarImage
              src={currentChild.avatar}
              alt={currentChild.firstName}
            />
            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-400 text-white text-lg font-bold">
              {currentChild.firstName[0]}
              {currentChild.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              {getGreeting()}, {currentChild.firstName}! 👋
            </h1>
            <p className="text-sm text-gray-600">
              Level {currentChild.rewards.level} Explorer
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
            <Zap className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-semibold text-yellow-700">
              {currentChild.rewards.points} pts
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={logout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Time Warning */}
      {showTimeWarning && (
        <Alert className="mb-6 border-orange-200 bg-orange-50">
          <Timer className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Almost time's up!</strong> You have{" "}
            {formatTime(getTimeRemaining())} left today.
          </AlertDescription>
        </Alert>
      )}

      {/* Out of Hours Warning */}
      {!isWithinAllowedHours() && (
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Moon className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Rest time!</strong> Screen time is from{" "}
            {currentChild.settings.screenTime.wakeupTime} to{" "}
            {currentChild.settings.screenTime.bedtime}.
          </AlertDescription>
        </Alert>
      )}

      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-white rounded-xl shadow-md">
            <TabsTrigger value="home" className="gap-2">
              <Home className="h-4 w-4" />
              Home
            </TabsTrigger>
            <TabsTrigger value="activities" className="gap-2">
              <Gamepad2 className="h-4 w-4" />
              Activities
            </TabsTrigger>
            <TabsTrigger value="achievements" className="gap-2">
              <Trophy className="h-4 w-4" />
              Rewards
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <Users className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-6">
            {/* Screen Time Status */}
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Clock className="h-5 w-5" />
                  Today's Screen Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">
                      {formatTime(
                        realTimeData?.currentUsage ||
                          currentChild.screenTime.today,
                      )}
                    </span>
                    <span className="text-blue-100">
                      of{" "}
                      {formatTime(currentChild.settings.screenTime.dailyLimit)}
                    </span>
                  </div>
                  <Progress
                    value={getProgressPercentage()}
                    className="h-3 bg-blue-300/20"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-100">
                      {formatTime(getTimeRemaining())} remaining
                    </span>
                    {getProgressPercentage() < 80 && (
                      <span className="text-green-200">🎉 Great job!</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-700">
                    {
                      currentChild.activities.filter(
                        (a) => a.category === "educational",
                      ).length
                    }
                  </p>
                  <p className="text-sm text-green-600">Learning Apps</p>
                </CardContent>
              </Card>

              <Card className="text-center bg-purple-50 border-purple-200">
                <CardContent className="p-4">
                  <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-700">
                    {currentChild.achievements.filter((a) => a.earned).length}
                  </p>
                  <p className="text-sm text-purple-600">Achievements</p>
                </CardContent>
              </Card>

              <Card className="text-center bg-yellow-50 border-yellow-200">
                <CardContent className="p-4">
                  <Zap className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-yellow-700">
                    {currentChild.rewards.points}
                  </p>
                  <p className="text-sm text-yellow-600">Points</p>
                </CardContent>
              </Card>

              <Card className="text-center bg-pink-50 border-pink-200">
                <CardContent className="p-4">
                  <Heart className="h-8 w-8 text-pink-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-pink-700">
                    {Math.floor(currentChild.rewards.weeklyProgress / 50)}
                  </p>
                  <p className="text-sm text-pink-600">Good Choices</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Today's Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentChild.activities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg border"
                      >
                        <div className={`p-2 rounded-lg ${activity.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.name}</p>
                          <p className="text-sm text-gray-600 capitalize">
                            {activity.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatTime(activity.time)}
                          </p>
                          <p className="text-xs text-gray-500">Today</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Recommended for You
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    {
                      name: "Math Adventures",
                      icon: Calculator,
                      category: "Educational",
                      color: "bg-blue-500",
                    },
                    {
                      name: "Art Studio",
                      icon: Palette,
                      category: "Creative",
                      color: "bg-purple-500",
                    },
                    {
                      name: "Code Playground",
                      icon: Code,
                      category: "Technology",
                      color: "bg-green-500",
                    },
                    {
                      name: "Music Maker",
                      icon: Music,
                      category: "Creative",
                      color: "bg-pink-500",
                    },
                    {
                      name: "Story Time",
                      icon: BookOpen,
                      category: "Reading",
                      color: "bg-orange-500",
                    },
                    {
                      name: "Science Lab",
                      icon: Zap,
                      category: "Educational",
                      color: "bg-yellow-500",
                    },
                  ].map((app, index) => {
                    const Icon = app.icon;
                    return (
                      <Card
                        key={index}
                        className="hover:shadow-lg transition-shadow cursor-pointer"
                      >
                        <CardContent className="p-4 text-center">
                          <div
                            className={`w-12 h-12 ${app.color} rounded-xl flex items-center justify-center mx-auto mb-3`}
                          >
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-sm mb-1">
                            {app.name}
                          </h3>
                          <p className="text-xs text-gray-600">
                            {app.category}
                          </p>
                          <Button size="sm" className="mt-2 w-full">
                            Open
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            {/* Progress to Next Level */}
            <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Trophy className="h-5 w-5" />
                  Level Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">
                      Level {currentChild.rewards.level}
                    </span>
                    <span className="text-yellow-100">
                      {currentChild.rewards.points} /{" "}
                      {currentChild.rewards.nextLevelPoints} pts
                    </span>
                  </div>
                  <Progress
                    value={
                      (currentChild.rewards.points /
                        currentChild.rewards.nextLevelPoints) *
                      100
                    }
                    className="h-3 bg-yellow-300/20"
                  />
                  <p className="text-yellow-100 text-sm">
                    {currentChild.rewards.nextLevelPoints -
                      currentChild.rewards.points}{" "}
                    points to Level {currentChild.rewards.level + 1}!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Achievements Grid */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Your Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentChild.achievements.map((achievement) => {
                    const Icon = achievement.icon;
                    return (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          achievement.earned
                            ? "border-green-200 bg-green-50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              achievement.earned
                                ? "bg-green-100"
                                : "bg-gray-100"
                            }`}
                          >
                            <Icon
                              className={`h-5 w-5 ${
                                achievement.earned
                                  ? "text-green-600"
                                  : "text-gray-400"
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">
                                {achievement.name}
                              </h3>
                              {achievement.earned && (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {achievement.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Goal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  This Week's Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Earn {currentChild.rewards.weeklyGoal} points</span>
                    <span className="font-semibold">
                      {currentChild.rewards.weeklyProgress} /{" "}
                      {currentChild.rewards.weeklyGoal}
                    </span>
                  </div>
                  <Progress
                    value={
                      (currentChild.rewards.weeklyProgress /
                        currentChild.rewards.weeklyGoal) *
                      100
                    }
                    className="h-2"
                  />
                  <p className="text-sm text-gray-600">
                    {currentChild.rewards.weeklyGoal -
                      currentChild.rewards.weeklyProgress}{" "}
                    more points to complete this week's goal!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  My Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-4 border-purple-200">
                    <AvatarImage
                      src={currentChild.avatar}
                      alt={currentChild.firstName}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-400 text-white text-xl font-bold">
                      {currentChild.firstName[0]}
                      {currentChild.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">
                      {currentChild.firstName} {currentChild.lastName}
                    </h3>
                    <p className="text-gray-600">Age {currentChild.age}</p>
                    <Badge className="mt-1">
                      Level {currentChild.rewards.level} Explorer
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-lg font-bold text-blue-700">
                      {formatTime(currentChild.screenTime.dailyAverage)}
                    </p>
                    <p className="text-sm text-blue-600">Daily Average</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-lg font-bold text-green-700">Safe</p>
                    <p className="text-sm text-green-600">Online Status</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  My Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <Camera className="h-4 w-4" />
                    Change Profile Picture
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    Safety Settings
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    disabled
                  >
                    <Clock className="h-4 w-4" />
                    Screen Time (Ask Parent)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Emergency */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-5 w-5" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-600 text-sm mb-3">
                  If you need help or feel unsafe, you can always ask for help.
                </p>
                <Button
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={() =>
                    requestHelp("Emergency help request from child dashboard")
                  }
                >
                  🆘 Ask for Help
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ChildDashboard;
