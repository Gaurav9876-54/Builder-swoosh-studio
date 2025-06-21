import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SafeGuardLogo } from "@/components/SafeGuardLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  Plus,
  ArrowRight,
  ArrowLeft,
  Shield,
  Bell,
  MapPin,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

const FamilySetup = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Form data
  const [familyData, setFamilyData] = useState({
    emergencyContacts: [
      { name: "", phone: "", relationship: "" },
      { name: "", phone: "", relationship: "" },
    ] as EmergencyContact[],
    defaultSettings: {
      contentFilterLevel: "moderate" as "strict" | "moderate" | "light",
      defaultScreenTime: 180, // 3 hours
      locationTracking: true,
      emergencyAlerts: true,
      parentalApproval: true,
    },
    notifications: {
      push: true,
      email: true,
      sms: false,
      emergencyOnly: false,
    },
  });

  const updateEmergencyContact = (
    index: number,
    field: keyof EmergencyContact,
    value: string,
  ) => {
    const contacts = [...familyData.emergencyContacts];
    contacts[index] = { ...contacts[index], [field]: value };
    setFamilyData({ ...familyData, emergencyContacts: contacts });
  };

  const addEmergencyContact = () => {
    setFamilyData({
      ...familyData,
      emergencyContacts: [
        ...familyData.emergencyContacts,
        { name: "", phone: "", relationship: "" },
      ],
    });
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Simulate family setup completion
      await new Promise((resolve) => setTimeout(resolve, 1500));
      navigate("/onboarding/add-child");
    } catch (error) {
      console.error("Family setup failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Emergency Contacts
              </h2>
              <p className="text-muted-foreground">
                Add trusted contacts who can be reached in case of emergency
              </p>
            </div>

            <div className="space-y-4">
              {familyData.emergencyContacts.map((contact, index) => (
                <Card key={index}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">
                        Contact {index + 1}
                        {index === 0 && (
                          <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                            Primary
                          </span>
                        )}
                      </h4>
                    </div>
                    <div className="grid gap-3">
                      <div>
                        <Label htmlFor={`name-${index}`}>Full Name</Label>
                        <Input
                          id={`name-${index}`}
                          placeholder="Enter full name"
                          value={contact.name}
                          onChange={(e) =>
                            updateEmergencyContact(
                              index,
                              "name",
                              e.target.value,
                            )
                          }
                          required={index === 0}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`phone-${index}`}>Phone Number</Label>
                        <Input
                          id={`phone-${index}`}
                          type="tel"
                          placeholder="Enter phone number"
                          value={contact.phone}
                          onChange={(e) =>
                            updateEmergencyContact(
                              index,
                              "phone",
                              e.target.value,
                            )
                          }
                          required={index === 0}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`relationship-${index}`}>
                          Relationship
                        </Label>
                        <Input
                          id={`relationship-${index}`}
                          placeholder="e.g., Grandparent, Aunt, Family Friend"
                          value={contact.relationship}
                          onChange={(e) =>
                            updateEmergencyContact(
                              index,
                              "relationship",
                              e.target.value,
                            )
                          }
                          required={index === 0}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                variant="outline"
                onClick={addEmergencyContact}
                className="w-full gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Another Contact
              </Button>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Default Safety Settings
              </h2>
              <p className="text-muted-foreground">
                Set up default protections that will apply to all your children
              </p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Content Protection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="contentFilter">Filter Level</Label>
                    <select
                      id="contentFilter"
                      className="w-full mt-1 p-2 border border-border rounded-md bg-background"
                      value={familyData.defaultSettings.contentFilterLevel}
                      onChange={(e) =>
                        setFamilyData({
                          ...familyData,
                          defaultSettings: {
                            ...familyData.defaultSettings,
                            contentFilterLevel: e.target.value as any,
                          },
                        })
                      }
                    >
                      <option value="strict">
                        Strict - Block most content, allow only educational
                      </option>
                      <option value="moderate">
                        Moderate - Balanced protection with some flexibility
                      </option>
                      <option value="light">
                        Light - Basic protection, more freedom
                      </option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="screenTime">
                      Default Daily Screen Time (hours)
                    </Label>
                    <Input
                      id="screenTime"
                      type="number"
                      min="1"
                      max="12"
                      value={familyData.defaultSettings.defaultScreenTime / 60}
                      onChange={(e) =>
                        setFamilyData({
                          ...familyData,
                          defaultSettings: {
                            ...familyData.defaultSettings,
                            defaultScreenTime: parseInt(e.target.value) * 60,
                          },
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Permissions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="locationTracking">
                        Location Tracking
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Track device locations for safety
                      </p>
                    </div>
                    <Switch
                      id="locationTracking"
                      checked={familyData.defaultSettings.locationTracking}
                      onCheckedChange={(checked) =>
                        setFamilyData({
                          ...familyData,
                          defaultSettings: {
                            ...familyData.defaultSettings,
                            locationTracking: checked,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="parentalApproval">
                        Require Parental Approval
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Apps and websites need approval
                      </p>
                    </div>
                    <Switch
                      id="parentalApproval"
                      checked={familyData.defaultSettings.parentalApproval}
                      onCheckedChange={(checked) =>
                        setFamilyData({
                          ...familyData,
                          defaultSettings: {
                            ...familyData.defaultSettings,
                            parentalApproval: checked,
                          },
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Bell className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Notification Preferences
              </h2>
              <p className="text-muted-foreground">
                Choose how you'd like to receive safety alerts and updates
              </p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotifications">
                      Push Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Instant alerts on your device
                    </p>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={familyData.notifications.push}
                    onCheckedChange={(checked) =>
                      setFamilyData({
                        ...familyData,
                        notifications: {
                          ...familyData.notifications,
                          push: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Daily summaries and important alerts
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={familyData.notifications.email}
                    onCheckedChange={(checked) =>
                      setFamilyData({
                        ...familyData,
                        notifications: {
                          ...familyData.notifications,
                          email: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Text messages for urgent alerts
                    </p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={familyData.notifications.sms}
                    onCheckedChange={(checked) =>
                      setFamilyData({
                        ...familyData,
                        notifications: {
                          ...familyData.notifications,
                          sms: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emergencyOnly">Emergency Only Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Only receive critical safety alerts
                    </p>
                  </div>
                  <Switch
                    id="emergencyOnly"
                    checked={familyData.notifications.emergencyOnly}
                    onCheckedChange={(checked) =>
                      setFamilyData({
                        ...familyData,
                        notifications: {
                          ...familyData.notifications,
                          emergencyOnly: checked,
                        },
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-success-100 rounded-full w-fit">
                <CheckCircle className="h-8 w-8 text-success-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Family Setup Complete! 🎉
              </h2>
              <p className="text-muted-foreground">
                Your family safety settings have been configured. Next, let's
                add your children's profiles.
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Setup Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Emergency Contacts:
                    </span>
                    <span>
                      {
                        familyData.emergencyContacts.filter(
                          (c) => c.name && c.phone,
                        ).length
                      }{" "}
                      configured
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Content Filter:
                    </span>
                    <span className="capitalize">
                      {familyData.defaultSettings.contentFilterLevel}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Daily Screen Time:
                    </span>
                    <span>
                      {familyData.defaultSettings.defaultScreenTime / 60} hours
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Location Tracking:
                    </span>
                    <span>
                      {familyData.defaultSettings.locationTracking
                        ? "Enabled"
                        : "Disabled"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You can always modify these settings later from your family
                dashboard.
              </AlertDescription>
            </Alert>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-safe-50 to-safe-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Progress */}
        <div className="text-center space-y-2">
          <SafeGuardLogo size="md" className="justify-center" />
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Family Setup - Step {currentStep + 1} of 4
            </p>
            <Progress value={((currentStep + 1) / 4) * 100} className="h-2" />
          </div>
        </div>

        {/* Content */}
        <Card>
          <CardContent className="p-8">{getStepContent()}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={isLoading}
            className="gap-2 min-w-[120px]"
          >
            {isLoading
              ? "Setting up..."
              : currentStep < 3
                ? "Next"
                : "Continue"}
            {!isLoading && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FamilySetup;
