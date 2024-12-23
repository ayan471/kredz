import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface SubscriptionStatusProps {
  isActive: boolean;
  isPending: boolean;
  expiryDate: Date | null;
}

export default function SubscriptionStatus({
  isActive,
  isPending,
  expiryDate,
}: SubscriptionStatusProps) {
  const now = new Date();
  const isExpired = expiryDate ? expiryDate < now : false;

  let statusColor = "bg-yellow-100 text-yellow-800";
  let StatusIcon = AlertCircle;
  let statusText = "Pending Activation";

  if (isActive) {
    statusColor = "bg-green-100 text-green-800";
    StatusIcon = CheckCircle;
    statusText = "Active";
  } else if (isExpired) {
    statusColor = "bg-red-100 text-red-800";
    StatusIcon = XCircle;
    statusText = "Expired";
  }

  return (
    <div
      className={`flex flex-col items-center justify-center p-4 rounded-lg ${statusColor}`}
    >
      <div className="flex items-center mb-2">
        <StatusIcon className="w-6 h-6 mr-2" />
        <span className="text-lg font-semibold">
          Subscription Status: {statusText}
        </span>
      </div>
      {isPending && (
        <p className="text-sm mt-2">
          Your subscription is awaiting payment confirmation. Please complete
          the payment process to activate your subscription.
        </p>
      )}
      {isActive && expiryDate && (
        <p className="text-sm mt-2">
          Your subscription is active and will expire on{" "}
          {expiryDate.toLocaleDateString()}.
        </p>
      )}
      {isExpired && (
        <p className="text-sm mt-2">
          Your subscription has expired. Please renew to continue accessing
          premium features.
        </p>
      )}
    </div>
  );
}
