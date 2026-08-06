// lib/sabpaisa-decrypt.ts
import crypto from "crypto";

export function decryptSabpaisaResponse(
  encResponse: string,
  authkey: string,
  authiv: string,
): Record<string, string> | null {
  try {
    // ✅ Use Uint8Array instead of Buffer to satisfy the type constraint
    const key = new TextEncoder().encode(authkey.slice(0, 16)); // AES-128 = 16 bytes
    const iv = new TextEncoder().encode(authiv.slice(0, 16));

    const decipher = crypto.createDecipheriv(
      "aes-128-cbc" as string, // cast to string to use overload 2
      key,
      iv,
    );
    decipher.setAutoPadding(true);

    const decoded = decodeURIComponent(encResponse);
    const decrypted =
      decipher.update(decoded, "base64", "utf8") + decipher.final("utf8");

    const result: Record<string, string> = {};
    for (const pair of decrypted.split("&")) {
      const [k, ...rest] = pair.split("=");
      if (k) result[k.trim()] = rest.join("=").trim();
    }

    console.log("Decrypted SabPaisa response:", result);
    return result;
  } catch (error) {
    console.error("SabPaisa decryption failed:", error);
    return null;
  }
}
