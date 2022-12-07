import sha256 from 'fast-sha256';
import { Node, Edge } from 'vis';
import defaultNodes from '../../assets/default-nodes.json';
import defaultEdges from '../../assets/default-edges.json';

export function generateRandomString(length: number) {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.-~';
  const charLength = chars.length;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charLength));
  }
  return result;
}

function base64UrlEncode(a: Uint8Array) {
  // Convert the ArrayBuffer to string using Uint8 array.
  // btoa takes chars from 0-255 and base64 encodes.
  // Then convert the base64 encoded to base64url encoded.
  // (replace + with -, replace / with _, trim trailing =)
  return btoa(String.fromCharCode.apply(null, Array.from(a)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function generateCodeChallenge(codeVerifier: string) {
  const hash = sha256(new TextEncoder().encode(codeVerifier));
  return base64UrlEncode(hash);
}

export async function delay(timeout: number) {
  return await new Promise((resolve) => setTimeout(resolve, timeout));
}

export function getDefaultData() {
  const nodes: Node[] = defaultNodes;
  const edges: Edge[] = defaultEdges;
  return {
    nodes,
    edges
  };
}
