export interface SharedQueryState {
  workspaceId: string;
  tableNames: string[];
  userQuery: string;
  generatedSql?: string;
  explanation?: string;
  executionPlan?: string[];
  recommendations?: string[];
}

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const encode = (state: SharedQueryState): string => {
  const json = JSON.stringify(state);
  const bytes = textEncoder.encode(json);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

const decode = (encoded: string): SharedQueryState => {
  const binary = atob(encoded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const json = textDecoder.decode(bytes);
  return JSON.parse(json) as SharedQueryState;
};

export const buildShareLink = (state: SharedQueryState): string => {
  const encoded = encode(state);
  const url = new URL(window.location.href);
  url.searchParams.set('share', encoded);
  url.hash = '';
  return url.toString();
};

export const parseSharedState = (encoded: string): SharedQueryState | null => {
  try {
    return decode(encoded);
  } catch (error) {
    console.error('Failed to parse shared query state', error);
    return null;
  }
};
