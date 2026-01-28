import crypto from "crypto";

/**
 * Parse the encryption key from PRISMA_FIELD_ENCRYPTION_KEY environment variable
 * Format: k1.aesgcm256.{base64Key}
 * Returns the 32-byte key buffer for AES-256
 */
function getEncryptionKey(): Buffer {
  const keyString = process.env.PRISMA_FIELD_ENCRYPTION_KEY;
  if (!keyString) {
    throw new Error("PRISMA_FIELD_ENCRYPTION_KEY environment variable is not set");
  }

  // Parse format: k1.aesgcm256.{base64Key}
  const parts = keyString.split(".");
  if (parts.length < 3) {
    throw new Error(
      `Invalid PRISMA_FIELD_ENCRYPTION_KEY format. Expected format: k1.aesgcm256.{base64Key}`
    );
  }

  const version = parts[0];
  const algorithm = parts[1];
  const base64Key = parts.slice(2).join("."); // In case base64 key contains dots

  if (algorithm !== "aesgcm256") {
    throw new Error(
      `Unsupported encryption algorithm: ${algorithm}. Only aesgcm256 is supported.`
    );
  }

  try {
    const keyBuffer = Buffer.from(base64Key, "base64");
    if (keyBuffer.length !== 32) {
      throw new Error(
        `Invalid key length: expected 32 bytes for AES-256, got ${keyBuffer.length} bytes`
      );
    }
    return keyBuffer;
  } catch (error) {
    throw new Error(`Failed to parse encryption key: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Cache the encryption key
let encryptionKey: Buffer | null = null;

function getKey(): Buffer {
  if (!encryptionKey) {
    encryptionKey = getEncryptionKey();
  }
  return encryptionKey;
}

/**
 * Encrypt a plaintext string using AES-GCM-256
 * @param plaintext - The string to encrypt
 * @returns Encrypted string in format: {iv}:{authTag}:{encryptedData} (all base64-encoded)
 */
export function encrypt(plaintext: string | null | undefined): string | null {
  if (plaintext === null || plaintext === undefined) {
    return null;
  }

  const key = getKey();
  const iv = crypto.randomBytes(12); // 12 bytes IV for GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  let encrypted = cipher.update(plaintext, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Format: iv:authTag:encryptedData (all base64)
  return `${iv.toString("base64")}:${authTag.toString("base64")}:${encrypted.toString("base64")}`;
}

/**
 * Decrypt a ciphertext string using AES-GCM-256
 * @param ciphertext - The encrypted string in format: {iv}:{authTag}:{encryptedData}
 * @returns Decrypted plaintext string
 */
export function decrypt(ciphertext: string | null | undefined): string | null {
  if (ciphertext === null || ciphertext === undefined) {
    return null;
  }

  const parts = ciphertext.split(":");
  if (parts.length !== 3) {
    throw new Error(
      `Invalid ciphertext format. Expected format: {iv}:{authTag}:{encryptedData}, got ${parts.length} parts`
    );
  }

  const [ivBase64, authTagBase64, encryptedBase64] = parts;

  try {
    const key = getKey();
    const iv = Buffer.from(ivBase64, "base64");
    const authTag = Buffer.from(authTagBase64, "base64");
    const encrypted = Buffer.from(encryptedBase64, "base64");

    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString("utf8");
  } catch (error) {
    throw new Error(
      `Decryption failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
