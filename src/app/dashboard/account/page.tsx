"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, Edit } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  const { userId, isLoaded } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const [showEditHint, setShowEditHint] = useState(false);
  const userButtonRef = useRef<HTMLDivElement>(null);

  if (!isLoaded || !isUserLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="animate-pulse text-blue-900 text-xl">Loading...</div>
      </div>
    );
  }

  if (!userId || !user) {
    redirect("/sign-in");
  }

  const handleAvatarClick = () => {
    // Programmatically click the UserButton
    if (userButtonRef.current) {
      const button = userButtonRef.current.querySelector("button");
      if (button) button.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-blue-900">My Account</h1>
          <p className="mt-2 text-lg text-blue-700">
            Your personal information at a glance
          </p>
        </div>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-orange-300">
          <CardHeader className="bg-gradient-to-r from-orange-400 to-blue-900 pb-6">
            <div className="flex flex-col items-center">
              {/* Avatar with overlaid UserButton */}
              <div
                className="relative cursor-pointer group"
                ref={userButtonRef}
                onMouseEnter={() => setShowEditHint(true)}
                onMouseLeave={() => setShowEditHint(false)}
              >
                {/* Position the UserButton directly over the avatar but make it invisible */}
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "opacity-0 w-24 h-24", // Make the button invisible but keep its position
                        userButtonPopoverCard:
                          "bg-white shadow-xl border border-orange-200",
                        userButtonPopoverActionButton:
                          "text-blue-900 hover:text-blue-700 hover:bg-orange-50",
                        userButtonPopoverActionButtonIcon: "text-orange-500",
                        userButtonPopoverFooter: "border-t border-orange-100",
                      },
                    }}
                  />
                </div>

                {/* Visual avatar (underneath the invisible UserButton) */}
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg transition-transform group-hover:scale-105 pointer-events-none">
                  <AvatarImage
                    src={user.imageUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                  <AvatarFallback>
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>

                {/* Edit overlay */}
                <div
                  className={`absolute inset-0 bg-blue-900/60 rounded-full flex items-center justify-center transition-opacity duration-200 pointer-events-none ${showEditHint ? "opacity-100" : "opacity-0"}`}
                >
                  <Edit className="h-8 w-8 text-white" />
                </div>
              </div>

              <CardTitle className="mt-4 text-2xl font-bold text-white">
                {user.firstName} {user.lastName}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 bg-orange-50">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-blue-900">
                <Mail className="h-5 w-5 text-orange-500 flex-shrink-0" />
                <span className="break-all">
                  {user.primaryEmailAddress?.emailAddress}
                </span>
              </div>
              <div className="flex items-center gap-3 text-blue-900">
                <Phone className="h-5 w-5 text-orange-500 flex-shrink-0" />
                <span>
                  {user.phoneNumbers[0]?.phoneNumber || "Not provided"}
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button
                onClick={() => {
                  if (userButtonRef.current) {
                    const button =
                      userButtonRef.current.querySelector("button");
                    if (button) button.click();
                  }
                }}
                className="bg-blue-900 hover:bg-blue-800 text-white"
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-blue-700">
          <p>
            Click on your avatar or the "Edit Profile" button to update your
            personal information.
          </p>
        </div>
      </div>
    </div>
  );
}
