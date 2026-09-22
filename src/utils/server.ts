import { DetectResponse } from '../types';

// Override at build time via EXPO_PUBLIC_API_BASE_URL (see .env.example).
// Defaults to your machine on the local network for development.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://192.168.1.100:8000';

export function detectUrl(): string {
  return `${API_BASE_URL}/detect`;
}

interface NativeAsset {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
  base64?: string | null;
}

export async function detectFood(
  asset: NativeAsset,
  conf = 0.3,
): Promise<DetectResponse> {
  const form = new FormData();
  const filename = asset.fileName ?? 'capture.jpg';
  const mimeType = asset.mimeType ?? 'image/jpeg';

  // @ts-expect-error: React Native FormData accepts objects with uri/name/type
  form.append('file', {
    uri: asset.uri,
    name: filename,
    type: mimeType,
  });

  const res = await fetch(`${detectUrl()}?conf=${conf}`, {
    method: 'POST',
    body: form,
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`Detection failed (${res.status})`);
  }
  return (await res.json()) as DetectResponse;
}