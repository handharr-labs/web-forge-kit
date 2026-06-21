/** Wraps the browser FileReader API — named FileReaderClient to avoid collision with the global. */
export interface FileReaderClient {
  readAsText(file: File): Promise<string>;
  readAsDataUrl(file: File): Promise<string>;
  readAsArrayBuffer(file: File): Promise<ArrayBuffer>;
  createObjectUrl(file: File | Blob): string;
  revokeObjectUrl(url: string): void;
}

export class BrowserFileReaderClient implements FileReaderClient {
  readAsText(file: File): Promise<string> {
    return this.read(file, (reader, f) => reader.readAsText(f));
  }

  readAsDataUrl(file: File): Promise<string> {
    return this.read(file, (reader, f) => reader.readAsDataURL(f));
  }

  readAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return this.read(file, (reader, f) => reader.readAsArrayBuffer(f));
  }

  createObjectUrl(file: File | Blob): string {
    return URL.createObjectURL(file);
  }

  revokeObjectUrl(url: string): void {
    URL.revokeObjectURL(url);
  }

  private read<T>(
    file: File,
    trigger: (reader: FileReader, file: File) => void
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as T);
      reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
      reader.onabort = () => reject(new Error(`File read aborted: ${file.name}`));
      trigger(reader, file);
    });
  }
}
