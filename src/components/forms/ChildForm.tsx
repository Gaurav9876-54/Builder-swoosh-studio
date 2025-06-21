import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Calendar,
  Camera,
  Shield,
  Clock,
  MapPin,
  MessageSquare,
  Smartphone,
  Globe,
  Plus,
  X,
  AlertCircle,
  Info,
} from "lucide-react";
import { Child, ChildSettings } from "@/types/auth";

interface ChildFormProps {
  child?: Partial<Child>;
  onSave: (childData: Partial<Child>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  mode: "create" | "edit";
}

export const ChildForm = ({
  child,
  onSave,
  onCancel,
  isLoading = false,
  mode,
}: ChildFormProps) => {
  const [formData, setFormData] = useState({
    firstName: child?.firstName || "",
    lastName: child?.lastName || "",
    dateOfBirth: child?.dateOfBirth || "",
    avatar: null as File | null,
  });

  const [settings, setSettings] = useState<ChildSettings>({
    screenTime: {
      dailyLimit: child?.settings?.screenTime?.dailyLimit || 180, // 3 hours
      bedtime: child?.settings?.screenTime?.bedtime || "21:00",
      wakeupTime: child?.settings?.screenTime?.wakeupTime || "07:00",
      blockedApps: child?.settings?.screenTime?.blockedApps || [],
      allowedWebsites: child?.settings?.screenTime?.allowedWebsites || [],
      blockedWebsites: child?.settings?.screenTime?.blockedWebsites || [],
    },
    location: {
      trackingEnabled: child?.settings?.location?.trackingEnabled ?? true,
      safeZones: child?.settings?.location?.safeZones || [],
      alertOnLeave: child?.settings?.location?.alertOnLeave ?? true,
    },
    contentFilter: {
      level: child?.settings?.contentFilter?.level || "moderate",
      customBlocked: child?.settings?.contentFilter?.customBlocked || [],
      allowEducational:
        child?.settings?.contentFilter?.allowEducational ?? true,
    },
    communication: {
      allowedContacts: child?.settings?.communication?.allowedContacts || [],
      monitorMessages: child?.settings?.communication?.monitorMessages ?? true,
      allowUnknownContacts:
        child?.settings?.communication?.allowUnknownContacts ?? false,
    },
  });

  const [newBlockedApp, setNewBlockedApp] = useState("");
  const [newBlockedWebsite, setNewBlockedWebsite] = useState("");
  const [newAllowedWebsite, setNewAllowedWebsite] = useState("");
  const [newContact, setNewContact] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors.length > 0) setErrors([]);
  };

  const updateSettings = (section: string, field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof ChildSettings],
        [field]: value,
      },
    }));
  };

  const addToList = (section: string, field: string, value: string) => {
    if (!value.trim()) return;
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof ChildSettings],
        [field]: [
          ...(prev[section as keyof ChildSettings][field as any] || []),
          value.trim(),
        ],
      },
    }));
  };

  const removeFromList = (section: string, field: string, index: number) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof ChildSettings],
        [field]: (
          prev[section as keyof ChildSettings][field as any] || []
        ).filter((_: any, i: number) => i !== index),
      },
    }));
  };

  const validateForm = () => {
    const newErrors = [];

    if (!formData.firstName.trim()) {
      newErrors.push("First name is required");
    }
    if (!formData.lastName.trim()) {
      newErrors.push("Last name is required");
    }
    if (!formData.dateOfBirth) {
      newErrors.push("Date of birth is required");
    } else {
      const age = calculateAge(formData.dateOfBirth);
      if (age < 3 || age > 18) {
        newErrors.push("Child must be between 3 and 18 years old");
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const childData: Partial<Child> = {
      ...formData,
      age: calculateAge(formData.dateOfBirth),
      settings,
    };

    await onSave(childData);
  };

  const getInitials = () => {
    return (
      (formData.firstName[0] || "") + (formData.lastName[0] || "")
    ).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc pl-4">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={
                    formData.avatar ? URL.createObjectURL(formData.avatar) : ""
                  }
                  alt="Child avatar"
                />
                <AvatarFallback className="bg-safe-100 text-safe-700 text-xl font-semibold">
                  {getInitials() || <User className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>
              <label className="absolute -bottom-1 -right-1 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                <Camera className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    updateFormData("avatar", e.target.files?.[0] || null)
                  }
                />
              </label>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Profile Photo</h3>
              <p className="text-sm text-muted-foreground">
                Add a photo to help identify your child's profile
              </p>
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={(e) => updateFormData("firstName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={(e) => updateFormData("lastName", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                className="pl-10"
                max={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
            {formData.dateOfBirth && (
              <p className="text-sm text-muted-foreground">
                Age: {calculateAge(formData.dateOfBirth)} years old
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Safety Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Safety Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="screentime" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="screentime">Screen Time</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="communication">Communication</TabsTrigger>
            </TabsList>

            {/* Screen Time Settings */}
            <TabsContent value="screentime" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <Label>Daily Screen Time Limit</Label>
                  <div className="mt-2 space-y-2">
                    <Slider
                      value={[settings.screenTime.dailyLimit]}
                      onValueChange={([value]) =>
                        updateSettings("screenTime", "dailyLimit", value)
                      }
                      max={720} // 12 hours
                      min={30}
                      step={15}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>30 min</span>
                      <span className="font-medium">
                        {Math.floor(settings.screenTime.dailyLimit / 60)}h{" "}
                        {settings.screenTime.dailyLimit % 60}m
                      </span>
                      <span>12 hours</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedtime">Bedtime</Label>
                    <Input
                      id="bedtime"
                      type="time"
                      value={settings.screenTime.bedtime}
                      onChange={(e) =>
                        updateSettings("screenTime", "bedtime", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wakeupTime">Wake Up Time</Label>
                    <Input
                      id="wakeupTime"
                      type="time"
                      value={settings.screenTime.wakeupTime}
                      onChange={(e) =>
                        updateSettings(
                          "screenTime",
                          "wakeupTime",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Blocked Apps</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add app name (e.g., TikTok, Instagram)"
                      value={newBlockedApp}
                      onChange={(e) => setNewBlockedApp(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addToList("screenTime", "blockedApps", newBlockedApp);
                          setNewBlockedApp("");
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="icon"
                      onClick={() => {
                        addToList("screenTime", "blockedApps", newBlockedApp);
                        setNewBlockedApp("");
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {settings.screenTime.blockedApps.map((app, index) => (
                      <Badge
                        key={index}
                        variant="destructive"
                        className="gap-1"
                      >
                        {app}
                        <button
                          onClick={() =>
                            removeFromList("screenTime", "blockedApps", index)
                          }
                          className="ml-1 hover:bg-destructive-foreground/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Content Filter Settings */}
            <TabsContent value="content" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Content Filter Level</Label>
                  <Select
                    value={settings.contentFilter.level}
                    onValueChange={(value: any) =>
                      updateSettings("contentFilter", "level", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select filter level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="strict">
                        <div className="space-y-1">
                          <p className="font-medium">Strict</p>
                          <p className="text-xs text-muted-foreground">
                            Only educational and pre-approved content
                          </p>
                        </div>
                      </SelectItem>
                      <SelectItem value="moderate">
                        <div className="space-y-1">
                          <p className="font-medium">Moderate</p>
                          <p className="text-xs text-muted-foreground">
                            Balanced protection with age-appropriate content
                          </p>
                        </div>
                      </SelectItem>
                      <SelectItem value="light">
                        <div className="space-y-1">
                          <p className="font-medium">Light</p>
                          <p className="text-xs text-muted-foreground">
                            Basic filtering, more freedom for older children
                          </p>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Educational Content</Label>
                    <p className="text-sm text-muted-foreground">
                      Educational websites bypass content filters
                    </p>
                  </div>
                  <Switch
                    checked={settings.contentFilter.allowEducational}
                    onCheckedChange={(checked) =>
                      updateSettings(
                        "contentFilter",
                        "allowEducational",
                        checked,
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Allowed Websites</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add website (e.g., khanacademy.org)"
                      value={newAllowedWebsite}
                      onChange={(e) => setNewAllowedWebsite(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addToList(
                            "screenTime",
                            "allowedWebsites",
                            newAllowedWebsite,
                          );
                          setNewAllowedWebsite("");
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="icon"
                      onClick={() => {
                        addToList(
                          "screenTime",
                          "allowedWebsites",
                          newAllowedWebsite,
                        );
                        setNewAllowedWebsite("");
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {settings.screenTime.allowedWebsites.map((site, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {site}
                        <button
                          onClick={() =>
                            removeFromList(
                              "screenTime",
                              "allowedWebsites",
                              index,
                            )
                          }
                          className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Blocked Websites</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add website to block"
                      value={newBlockedWebsite}
                      onChange={(e) => setNewBlockedWebsite(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addToList(
                            "screenTime",
                            "blockedWebsites",
                            newBlockedWebsite,
                          );
                          setNewBlockedWebsite("");
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="icon"
                      onClick={() => {
                        addToList(
                          "screenTime",
                          "blockedWebsites",
                          newBlockedWebsite,
                        );
                        setNewBlockedWebsite("");
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {settings.screenTime.blockedWebsites.map((site, index) => (
                      <Badge
                        key={index}
                        variant="destructive"
                        className="gap-1"
                      >
                        {site}
                        <button
                          onClick={() =>
                            removeFromList(
                              "screenTime",
                              "blockedWebsites",
                              index,
                            )
                          }
                          className="ml-1 hover:bg-destructive-foreground/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Location Settings */}
            <TabsContent value="location" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Location Tracking</Label>
                    <p className="text-sm text-muted-foreground">
                      Track device location for safety
                    </p>
                  </div>
                  <Switch
                    checked={settings.location.trackingEnabled}
                    onCheckedChange={(checked) =>
                      updateSettings("location", "trackingEnabled", checked)
                    }
                  />
                </div>

                {settings.location.trackingEnabled && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Alert When Leaving Safe Zones</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when child leaves designated areas
                        </p>
                      </div>
                      <Switch
                        checked={settings.location.alertOnLeave}
                        onCheckedChange={(checked) =>
                          updateSettings("location", "alertOnLeave", checked)
                        }
                      />
                    </div>

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Safe zones (like home and school) can be set up after
                        creating the child profile from the location management
                        page.
                      </AlertDescription>
                    </Alert>
                  </>
                )}
              </div>
            </TabsContent>

            {/* Communication Settings */}
            <TabsContent value="communication" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Monitor Messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Review messages for safety (without AI analysis)
                    </p>
                  </div>
                  <Switch
                    checked={settings.communication.monitorMessages}
                    onCheckedChange={(checked) =>
                      updateSettings(
                        "communication",
                        "monitorMessages",
                        checked,
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Unknown Contacts</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow communication with non-approved contacts
                    </p>
                  </div>
                  <Switch
                    checked={settings.communication.allowUnknownContacts}
                    onCheckedChange={(checked) =>
                      updateSettings(
                        "communication",
                        "allowUnknownContacts",
                        checked,
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Allowed Contacts</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add contact name or number"
                      value={newContact}
                      onChange={(e) => setNewContact(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addToList(
                            "communication",
                            "allowedContacts",
                            newContact,
                          );
                          setNewContact("");
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="icon"
                      onClick={() => {
                        addToList(
                          "communication",
                          "allowedContacts",
                          newContact,
                        );
                        setNewContact("");
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {settings.communication.allowedContacts.map(
                      (contact, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="gap-1"
                        >
                          {contact}
                          <button
                            onClick={() =>
                              removeFromList(
                                "communication",
                                "allowedContacts",
                                index,
                              )
                            }
                            className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button onClick={handleSave} className="flex-1" disabled={isLoading}>
          {isLoading
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : mode === "create"
              ? "Create Child Profile"
              : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};
