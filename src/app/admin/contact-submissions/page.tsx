import { getContactSubmissions } from "@/actions/contactActions";
import { ContactSubmissionsTable } from "./components/ContactSubmissionsTable";

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
};

export default async function ContactSubmissionsPage() {
  const initialSubmissions: ContactSubmission[] = await getContactSubmissions();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-6">
          Contact Form Submissions
        </h1>
        <div>
          <ContactSubmissionsTable initialSubmissions={initialSubmissions} />
        </div>
      </div>
    </div>
  );
}
