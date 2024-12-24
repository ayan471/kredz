export default function PaymentErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Payment Error
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            There was an error processing your payment. Please try again or
            contact support if the problem persists.
          </p>
        </div>
      </div>
    </div>
  );
}
