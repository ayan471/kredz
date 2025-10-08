import type { Metadata } from "next";
import DisclaimerContent from "./disclaimer-content";

export const metadata: Metadata = {
  title: "Kredz | Disclaimer",
  description:
    "Important information about the use of Kredz website and services.",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <DisclaimerContent />
    </div>
  );
}
