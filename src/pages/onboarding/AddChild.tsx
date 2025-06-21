import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SafeGuardLogo } from "@/components/SafeGuardLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Calendar,
  Camera,
  Plus,
  Trash2,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface ChildFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  avatar?: File;
}

const AddChild = () => {
  const navigate = useNavigate();
  const { addChild } = useAuth();
  const [children, setChildren] = useState<ChildFormData[]>([
    {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [completedChildren, setCompletedChildren] = useState<number[]>([]);

  const updateChild = (
    index: number,
    field: keyof ChildFormData,
    value: any,
  ) => {
    const updated = [...children];
    updated[index] = { ...updated[index], [field]: value };
    setChildren(updated);
    if (error) setError("");
  };

  const addNewChild = () => {
    setChildren([
      ...children,
      {
        firstName: "",
        lastName: "",
        dateOfBirth: "",
      },
    ]);
  };

  const removeChild = (index: number) => {
    if (children.length > 1) {
      setChildren(children.filter((_, i) => i !== index));
      setCompletedChildren(completedChildren.filter((i) => i !== index));
    }
  };

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

  const getChildInitials = (child: ChildFormData) => {
    return (child.firstName[0] || "") + (child.lastName[0] || "");
  };

  const handleAvatarUpload = (index: number, file: File | null) => {
    updateChild(index, "avatar", file);
  };

  const isChildComplete = (child: ChildFormData) => {
    return child.firstName && child.lastName && child.dateOfBirth;
  };

  const handleSubmit = async () => {
    const validChildren = children.filter(isChildComplete);

    if (validChildren.length === 0) {
      setError("Please add at least one child with complete information.");
      return;
    }

    setIsLoading(true);
    try {
      // Add each child to the family
      for (const child of validChildren) {
        await addChild(child);
      }
      navigate("/");
    } catch (err) {
      setError("Failed to add children. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-safe-50 to-safe-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <SafeGuardLogo size="md" className="justify-center" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Add Your Children
            </h1>
            <p className="text-muted-foreground">
              Create profiles for each child you want to protect
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Children Forms */}
        <div className="space-y-4">
          {children.map((child, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Child {index + 1}
                    {isChildComplete(child) && (
                      <CheckCircle className="h-4 w-4 text-success-600" />
                    )}
                  </CardTitle>
                  {children.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeChild(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Avatar Upload */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={
                          child.avatar ? URL.createObjectURL(child.avatar) : ""
                        }
                        alt={`${child.firstName} ${child.lastName}`}
                      />
                      <AvatarFallback className="bg-safe-100 text-safe-700 text-lg font-semibold">
                        {getChildInitials(child) || (
                          <User className="h-6 w-6" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <label
                      htmlFor={`avatar-${index}`}
                      className="absolute -bottom-1 -right-1 p-1 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                    >
                      <Camera className="h-3 w-3" />
                    </label>
                    <input
                      id={`avatar-${index}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleAvatarUpload(
                          index,
                          e.target.files ? e.target.files[0] : null,
                        )
                      }
                    />
                  </div>
                  <div className="flex-1 text-sm text-muted-foreground">
                    <p>
                      Optional: Add a photo for{" "}
                      {child.firstName || "this child"}
                    </p>
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`firstName-${index}`}>First Name</Label>
                    <Input
                      id={`firstName-${index}`}
                      placeholder="First name"
                      value={child.firstName}
                      onChange={(e) =>
                        updateChild(index, "firstName", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`lastName-${index}`}>Last Name</Label>
                    <Input
                      id={`lastName-${index}`}
                      placeholder="Last name"
                      value={child.lastName}
                      onChange={(e) =>
                        updateChild(index, "lastName", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <Label htmlFor={`dob-${index}`}>Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id={`dob-${index}`}
                      type="date"
                      value={child.dateOfBirth}
                      onChange={(e) =>
                        updateChild(index, "dateOfBirth", e.target.value)
                      }
                      className="pl-10"
                      max={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  {child.dateOfBirth && (
                    <p className="text-sm text-muted-foreground">
                      Age: {calculateAge(child.dateOfBirth)} years old
                    </p>
                  )}
                </div>

                {/* Completion Status */}
                {isChildComplete(child) && (
                  <div className="p-3 bg-success-50 border border-success-200 rounded-lg">
                    <div className="flex items-center gap-2 text-success-700">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Profile complete for {child.firstName} {child.lastName}{" "}
                        (Age {calculateAge(child.dateOfBirth)})
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Another Child */}
        <Button
          variant="outline"
          onClick={addNewChild}
          className="w-full gap-2"
          disabled={children.length >= 5}
        >
          <Plus className="h-4 w-4" />
          Add Another Child
        </Button>

        {children.length >= 5 && (
          <p className="text-sm text-muted-foreground text-center">
            Maximum of 5 children per family. Contact support for larger
            families.
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4">
          <Button variant="ghost" onClick={handleSkip}>
            Skip for Now
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isLoading || children.filter(isChildComplete).length === 0
            }
            className="gap-2 min-w-[140px]"
          >
            {isLoading ? "Adding Children..." : "Complete Setup"}
            {!isLoading && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            You can add more children later from your family dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddChild;
