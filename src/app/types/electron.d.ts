interface ElectronAPI {
  send: (channel: string, data: unknown) => void;
  receive: (channel: string, func: (...args: unknown[]) => void) => void;
  platform: string;
}

declare global {
  interface Window {
    api?: ElectronAPI;
  }
}

export {}; 