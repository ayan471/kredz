import { auth } from "@clerk/nextjs/server";
import { getUserSubscription } from "@/actions/formActions";
import { Sidebar } from "./components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  const subscription = userId ? await getUserSubscription(userId) : null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar subscription={subscription} />
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
