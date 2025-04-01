export interface UploadedImage {
  public_id: string;
  url: string;
  width: number;
  height: number;
}

export interface CloudinaryUploadResponse {
  success: boolean;
  images: UploadedImage[];
}