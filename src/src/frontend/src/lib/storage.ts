export class ExternalBlob {
  private bytes?: Uint8Array;
  private url?: string;
  private progressCallback?: (percentage: number) => void;

  private constructor() {}

  static fromURL(url: string): ExternalBlob {
    const blob = new ExternalBlob();
    blob.url = url;
    return blob;
  }

  static fromBytes(bytes: Uint8Array): ExternalBlob {
    const blob = new ExternalBlob();
    blob.bytes = bytes;
    return blob;
  }

  withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob {
    this.progressCallback = onProgress;
    return this;
  }

  async getBytes(): Promise<Uint8Array> {
    if (this.bytes) {
      return this.bytes;
    }
    if (this.url) {
      const response = await fetch(this.url);
      const arrayBuffer = await response.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    }
    throw new Error('No bytes or URL available');
  }

  getDirectURL(): string {
    if (this.url) {
      return this.url;
    }
    if (this.bytes) {
      const blob = new Blob([this.bytes as BlobPart]);
      return URL.createObjectURL(blob);
    }
    throw new Error('No URL or bytes available');
  }

  // Upload simulation (in real implementation this would upload to backend)
  async upload(): Promise<string> {
    if (!this.bytes) {
      throw new Error('No bytes to upload');
    }

    // Simulate progress
    if (this.progressCallback) {
      for (let i = 0; i <= 100; i += 10) {
        this.progressCallback(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Create blob URL
    const blob = new Blob([this.bytes as BlobPart]);
    const url = URL.createObjectURL(blob);
    this.url = url;
    return url;
  }
}

export async function uploadImageFile(file: File, onProgress?: (percentage: number) => void): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const blob = ExternalBlob.fromBytes(bytes);
  
  if (onProgress) {
    blob.withUploadProgress(onProgress);
  }

  return blob.upload();
}
