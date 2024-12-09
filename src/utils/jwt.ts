export const importSecretKey = async (): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(Deno.env.get("JWT_SECRET")!);
  return await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign", "verify"],
  );
};
