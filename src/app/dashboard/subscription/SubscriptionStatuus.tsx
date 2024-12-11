import { CheckCircle, XCircle } from "lucide-react";

interface SubscriptionStatusProps {
  isActive: boolean;
}

export default function SubscriptionStatus({
  isActive,
}: SubscriptionStatusProps) {
  return (
    <div
      className={`flex items-center justify-center p-4 rounded-lg ${
        isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {isActive ? (
        <>
          <CheckCircle className="w-6 h-6 mr-2" />
          <span className="text-lg font-semibold">
            Your subscription is active
          </span>
        </>
      ) : (
        <>
          <XCircle className="w-6 h-6 mr-2" />
          <span className="text-lg font-semibold">
            Your subscription has expired
          </span>
        </>
      )}
    </div>
  );
}
