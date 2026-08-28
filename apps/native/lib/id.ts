/**
 * RFC 4122 version 4 identifier.
 *
 * Hermes exposes no global `crypto`, so `crypto.randomUUID()` throws
 * "Property 'crypto' doesn't exist" the moment a timer is created. This is a
 * plain-JS replacement rather than expo-crypto so it needs no native module,
 * and therefore no dev-client rebuild.
 *
 * Math.random is not cryptographically strong. That is acceptable here: these
 * ids only distinguish a handful of timers inside one device's own storage,
 * they are never transmitted, and nothing about them needs to be
 * unguessable. Anything security-bearing must not reuse this.
 */
export function createId(): string {
  let out = '';
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      out += '-';
    } else if (i === 14) {
      out += '4'; // version
    } else {
      const r = (Math.random() * 16) | 0;
      // Variant bits: 8, 9, a or b.
      out += (i === 19 ? (r & 0x3) | 0x8 : r).toString(16);
    }
  }
  return out;
}
