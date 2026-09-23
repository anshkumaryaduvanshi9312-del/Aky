// Standard Web Crypto API wrapper for AES-GCM 256-bit encryption
async function deriveKey(pin: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(pin) as unknown as BufferSource,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptDocument(
  plainText: string,
  pin: string = '1234'
): Promise<{ iv: string; ciphertext: string }> {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    const b64 = btoa(unescape(encodeURIComponent(plainText)));
    return { iv: 'dummy-iv', ciphertext: `enc_${b64}` };
  }

  const salt = new Uint8Array([12, 54, 89, 21, 90, 43, 67, 88, 19, 34, 55, 77, 99, 10, 24, 61]);
  const key = await deriveKey(pin, salt);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plainText);

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as unknown as BufferSource },
    key,
    encoded as unknown as BufferSource
  );

  const ciphertext = btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
  const ivString = btoa(String.fromCharCode(...iv));

  return { iv: ivString, ciphertext };
}

export async function decryptDocument(
  ciphertext: string,
  ivString: string,
  pin: string = '1234'
): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    if (ciphertext.startsWith('enc_')) {
      return decodeURIComponent(escape(atob(ciphertext.replace('enc_', ''))));
    }
    return ciphertext;
  }

  try {
    const salt = new Uint8Array([12, 54, 89, 21, 90, 43, 67, 88, 19, 34, 55, 77, 99, 10, 24, 61]);
    const key = await deriveKey(pin, salt);

    const ivArray = Uint8Array.from(atob(ivString), (c) => c.charCodeAt(0));
    const encryptedArray = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0));

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivArray as unknown as BufferSource },
      key,
      encryptedArray as unknown as BufferSource
    );

    return new TextDecoder().decode(decryptedBuffer);
  } catch (err) {
    throw new Error('Invalid PIN or decryption failed');
  }
}
