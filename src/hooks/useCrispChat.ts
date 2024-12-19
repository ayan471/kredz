import { useEffect } from "react";
import { configureCrisp } from "@/config/crispConfig";

declare global {
  interface Window {
    $crisp: any;
    CRISP_WEBSITE_ID: string;
  }
}

export const useCrispChat = () => {
  useEffect(() => {
    // Load the Crisp script
    (function () {
      const d = document;
      const s = d.createElement("script");
      s.src = "https://client.crisp.chat/l.js";
      s.async = true;
      d.getElementsByTagName("head")[0].appendChild(s);
    })();

    // Initialize Crisp
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "36fb5ec2-a43f-47ac-b750-12d1a650d6ec"; // Replace with your actual Crisp Website ID

    // Configure Crisp
    configureCrisp();
  }, []);
};
