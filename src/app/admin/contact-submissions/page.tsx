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
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-10">
        <h1 className="text-2xl font-semibold mb-5">
          Contact Form Submissions
        </h1>
        <ContactSubmissionsTable initialSubmissions={initialSubmissions} />
      </div>
    </div>
  );
}
