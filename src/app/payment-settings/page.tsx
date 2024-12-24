"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PaymentSettings() {
  const [redirectUrl, setRedirectUrl] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/payment-settings");
      if (response.ok) {
        const data = await response.json();
        setRedirectUrl(data.redirectUrl || "");
        setWebhookUrl(data.webhookUrl || "");
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/payment-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ redirectUrl, webhookUrl }),
      });

      if (response.ok) {
        setMessage("Settings saved successfully!");
      } else {
        setMessage("Failed to save settings. Please try again.");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Payment Settings</CardTitle>
          <CardDescription>
            Manage your payment webhook and redirect URL settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="redirectUrl" className="text-sm font-medium">
              Redirect URL
            </label>
            <Input
              id="redirectUrl"
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
              placeholder="https://your-domain.com/payment-callback"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="webhookUrl" className="text-sm font-medium">
              Webhook URL
            </label>
            <Input
              id="webhookUrl"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-domain.com/api/phonepe-webhook"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
          {message && <p className="ml-4 text-sm">{message}</p>}
        </CardFooter>
      </Card>
    </div>
  );
}
