import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone } from "lucide-react";

export default async function AccountPage() {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();

  if (!user) {
    return <div>Loading...</div>;
  }

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
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage
                  src={user.imageUrl}
                  alt={`${user.firstName} ${user.lastName}`}
                />
                <AvatarFallback>
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4 text-2xl font-bold text-white">
                {user.firstName} {user.lastName}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 bg-orange-50">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-blue-900">
                <Mail className="h-5 w-5 text-orange-500" />
                <span>{user.emailAddresses[0].emailAddress}</span>
              </div>
              <div className="flex items-center gap-3 text-blue-900">
                <Phone className="h-5 w-5 text-orange-500" />
                <span>
                  {user.phoneNumbers[0]?.phoneNumber || "Not provided"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-blue-700">
          <p>
            This information is managed through Clerk. To update your profile,
            please use the Clerk user management interface.
          </p>
        </div>
      </div>
    </div>
  );
}
