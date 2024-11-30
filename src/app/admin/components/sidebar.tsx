import Link from "next/link";
import { Home, Users, CreditCard, FileText, Wallet } from "lucide-react";

export function Sidebar() {
  return (
    <div className="flex flex-col w-72 bg-gray-800">
      <div className="flex items-center justify-center h-20 shadow-md">
        <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
      </div>
      <ul className="flex flex-col py-4">
        <li>
          <Link
            href="/admin"
            className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white"
          >
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <Home />
            </span>
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
        </li>

        <li>
          <Link
            href="/admin/credit-builder"
            className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white"
          >
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <CreditCard />
            </span>
            <span className="text-sm font-medium">Credit Builder</span>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/loans"
            className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white"
          >
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <FileText />
            </span>
            <span className="text-sm font-medium">Loans</span>
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white"
          >
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <Users />
            </span>
            <span className="text-sm font-medium">
              Channel Partner{" "}
              <span className="my-auto text-xs border rounded-full px-2 py-1">
                Coming Soon
              </span>
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white"
          >
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <Wallet />
            </span>
            <span className="text-sm font-medium">
              Loan Consultancy{" "}
              <span className="my-auto text-xs border rounded-full px-2 py-1">
                Coming Soon
              </span>
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
