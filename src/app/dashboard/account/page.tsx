import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AccountPage() {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Account</h1>
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Name:</strong> {user?.firstName} {user?.lastName}
          </p>
          <p>
            <strong>Email:</strong> {user?.emailAddresses[0].emailAddress}
          </p>
          <p>
            <strong>Phone:</strong>{" "}
            {user?.phoneNumbers[0]?.phoneNumber || "Not provided"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
