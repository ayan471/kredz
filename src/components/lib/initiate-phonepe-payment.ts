export async function initiatePhonePePayment(paymentDetails: {
  amount: number;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
}) {
  try {
    const response = await fetch("/api/initiate-phonepe-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentDetails),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to initiate payment");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error initiating PhonePe payment:", error);
    throw error;
  }
}
