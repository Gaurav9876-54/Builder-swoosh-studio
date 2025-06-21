import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ChildForm } from "@/components/forms/ChildForm";
import { MobileNav, SOSButton } from "@/components/ui/mobile-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Plus,
  Users,
  MoreVertical,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Clock,
  Shield,
  MapPin,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Settings,
} from "lucide-react";
import { Child } from "@/types/auth";

type ViewMode = "list" | "add" | "edit";

const FamilyManagement = () => {
  const { state, addChild, updateChild, removeChild } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [childToDelete, setChildToDelete] = useState<Child | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleAddChild = async (childData: Partial<Child>) => {
    setIsLoading(true);
    try {
      await addChild({
        firstName: childData.firstName!,
        lastName: childData.lastName!,
        dateOfBirth: childData.dateOfBirth!,
        initialSettings: childData.settings,
      });
      setMessage({
        type: "success",
        text: `${childData.firstName} has been added to your family!`,
      });
      setViewMode("list");
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to add child. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditChild = async (childData: Partial<Child>) => {
    if (!selectedChild) return;

    setIsLoading(true);
    try {
      await updateChild(selectedChild.id, childData);
      setMessage({
        type: "success",
        text: `${childData.firstName}'s profile has been updated!`,
      });
      setViewMode("list");
      setSelectedChild(null);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to update child profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChild = async () => {
    if (!childToDelete) return;

    setIsLoading(true);
    try {
      await removeChild(childToDelete.id);
      setMessage({
        type: "success",
        text: `${childToDelete.firstName}'s profile has been removed.`,
      });
      setDeleteDialogOpen(false);
      setChildToDelete(null);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to remove child profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
  };

  const getContentFilterColor = (level: string) => {
    switch (level) {
      case "strict":
        return "bg-red-100 text-red-800";
      case "moderate":
        return "bg-yellow-100 text-yellow-800";
      case "light":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (viewMode === "add") {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="bg-white border-b border-border px-4 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("list")}
                className="rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold">Add Child</h1>
            </div>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-6">
          <ChildForm
            mode="create"
            onSave={handleAddChild}
            onCancel={() => setViewMode("list")}
            isLoading={isLoading}
          />
        </main>

        <MobileNav />
        <SOSButton />
      </div>
    );
  }

  if (viewMode === "edit" && selectedChild) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="bg-white border-b border-border px-4 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setViewMode("list");
                  setSelectedChild(null);
                }}
                className="rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold">
                Edit {selectedChild.firstName}
              </h1>
            </div>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-6">
          <ChildForm
            child={selectedChild}
            mode="edit"
            onSave={handleEditChild}
            onCancel={() => {
              setViewMode("list");
              setSelectedChild(null);
            }}
            isLoading={isLoading}
          />
        </main>

        <MobileNav />
        <SOSButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-white border-b border-border px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Link to="/settings">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Family Management</h1>
          </div>
          <Button
            onClick={() => setViewMode("add")}
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Child
          </Button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {message && (
          <Alert variant={message.type === "error" ? "destructive" : "default"}>
            {message.type === "error" ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Family Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {state.family?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">
                  {state.children.length}
                </p>
                <p className="text-sm text-muted-foreground">Children</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-success-600">
                  {state.children.filter((child) => child.isOnline).length}
                </p>
                <p className="text-sm text-muted-foreground">Online</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-safe-600">
                  {state.family?.subscription.tier === "premium" ? "∞" : "5"}
                </p>
                <p className="text-sm text-muted-foreground">Max Children</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Children List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Children</h2>
            {state.children.length === 0 && (
              <Badge variant="secondary">No children added</Badge>
            )}
          </div>

          {state.children.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">
                  No Children Added Yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start protecting your family by adding your first child's
                  profile.
                </p>
                <Button onClick={() => setViewMode("add")} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Your First Child
                </Button>
              </CardContent>
            </Card>
          ) : (
            state.children.map((child) => (
              <Card key={child.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Avatar & Basic Info */}
                    <div className="flex items-center gap-3 flex-1">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={child.avatar}
                            alt={child.firstName}
                          />
                          <AvatarFallback className="bg-safe-100 text-safe-700 font-semibold">
                            {getInitials(child.firstName, child.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                            child.isOnline ? "bg-success-500" : "bg-muted"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">
                            {child.firstName} {child.lastName}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {child.age}y
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Screen time today:{" "}
                          {formatTime(child.screenTime.today)}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedChild(child);
                            setViewMode("edit");
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setChildToDelete(child);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Child
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Safety Settings Summary */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Limit:{" "}
                        {formatTime(child.settings.screenTime.dailyLimit)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <Badge
                        className={`text-xs ${getContentFilterColor(child.settings.contentFilter.level)}`}
                      >
                        {child.settings.contentFilter.level}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Location:{" "}
                        {child.settings.location.trackingEnabled ? "On" : "Off"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Monitor:{" "}
                        {child.settings.communication.monitorMessages
                          ? "On"
                          : "Off"}
                      </span>
                    </div>
                  </div>

                  {/* Active Restrictions */}
                  {(child.settings.screenTime.blockedApps.length > 0 ||
                    child.settings.screenTime.blockedWebsites.length > 0) && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <Settings className="h-3 w-3" />
                        Active Restrictions
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {child.settings.screenTime.blockedApps
                          .slice(0, 3)
                          .map((app, index) => (
                            <Badge
                              key={index}
                              variant="destructive"
                              className="text-xs"
                            >
                              {app}
                            </Badge>
                          ))}
                        {child.settings.screenTime.blockedApps.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{child.settings.screenTime.blockedApps.length - 3}{" "}
                            more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Family Subscription Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium capitalize">
                  {state.family?.subscription.tier} Plan
                </p>
                <p className="text-sm text-muted-foreground">
                  Status: {state.family?.subscription.status}
                </p>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Child Profile</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {childToDelete?.firstName}'s
              profile? This action cannot be undone and will permanently delete
              all their data and settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteChild}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove Profile
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <MobileNav />
      <SOSButton />
    </div>
  );
};

export default FamilyManagement;
