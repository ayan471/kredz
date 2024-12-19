"use client";

import { useCrispChat } from "@/hooks/useCrispChat";

export default function CrispProvider() {
  useCrispChat();
  return null;
}
