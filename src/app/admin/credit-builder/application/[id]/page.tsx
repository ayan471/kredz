import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { DownloadCSV } from "./download-csv";

const prisma = new PrismaClient();

async function getApplicationData(id: string) {
  const applicationData = await prisma.creditBuilderApplicationData.findUnique({
    where: { id },
  });

  if (!applicationData) {
    notFound();
  }

  return applicationData;
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const applicationData = await getApplicationData(params.id);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Application Details</h1>
        <DownloadCSV data={applicationData} />
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Credit Builder Application Information
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {applicationData.fullName || "N/A"}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Phone number
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {applicationData.phoneNo || "N/A"}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Aadhar number
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {applicationData.aadharNo || "N/A"}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">PAN number</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {applicationData.panNo || "N/A"}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Credit score
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {applicationData.creditScore || "N/A"}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Current step
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {applicationData.step}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Created at</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(applicationData.createdAt).toLocaleString()}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Last updated
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(applicationData.updatedAt).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
