export interface FileDownloader {
  fromUrl(url: string, filename: string): void;
  fromBlob(blob: Blob, filename: string): void;
  fromText(text: string, filename: string, mimeType?: string): void;
}

export class BrowserFileDownloader implements FileDownloader {
  fromUrl(url: string, filename: string): void {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.rel = "noopener noreferrer";
    anchor.click();
  }

  fromBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    try {
      this.fromUrl(url, filename);
    } finally {
      // Delay revoke so the browser has time to initiate the download
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }

  fromText(text: string, filename: string, mimeType = "text/plain"): void {
    const blob = new Blob([text], { type: mimeType });
    this.fromBlob(blob, filename);
  }
}
