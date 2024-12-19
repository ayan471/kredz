export const configureCrisp = () => {
  if (typeof window !== "undefined" && window.$crisp) {
    // Customize the chat widget colors
    window.$crisp.push(["config", "color:theme", "#4CAF50"]);

    // Set the welcome message
    window.$crisp.push([
      "set",
      "message:text",
      "Hello! How can we help you today?",
    ]);

    // Hide the user avatar
    window.$crisp.push(["config", "hide:avatar", true]);

    // Position the chat widget (right or left)
    window.$crisp.push(["config", "position:right", true]);

    // Add any other customizations you want
  }
};
