export async function sendWhatsAppNotification(
  phoneNumber: string,
  name: string
): Promise<boolean> {
  const apiKey = process.env.NEXT_PUBLIC_AISENSY_API_KEY;
  const templateName = "test";
  const apiUrl = `https://backend.aisensy.com/campaign/t1/api/v2`;

  const payload = {
    apiKey,
    campaignName: "test_campaign",
    destination: phoneNumber,
    userName: name,
    templateName,
    language: "en",
    parameters: [
      {
        name: "Kredz",
        value: name,
      },
    ],
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from Aisensy API:", errorData);
      return false;
    }

    const data = await response.json();
    console.log("WhatsApp notification sent successfully:", data);
    return true;
  } catch (error) {
    console.error("Error sending WhatsApp notification:", error);
    return false;
  }
}
