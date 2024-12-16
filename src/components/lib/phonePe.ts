interface PhonePePaymentParams {
  amount: number;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
}

export async function initiatePhonePePayment(params: PhonePePaymentParams) {
  try {
    console.log("Sending payment request with params:", params);
    const response = await fetch("/api/initiate-phonepe-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (response.ok && data.paymentUrl) {
      return { success: true, paymentUrl: data.paymentUrl };
    } else {
      console.error("Payment initiation failed:", data);
      return {
        success: false,
        error: data.error || "Failed to initiate payment",
      };
    }
  } catch (error) {
    console.error("Error initiating PhonePe payment:", error);
    let errorMessage = "An unexpected error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}
