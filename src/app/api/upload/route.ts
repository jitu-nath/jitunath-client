import { NextRequest, NextResponse } from 'next/server';

import {  UploadedImage } from '@/types/cloudinary';
import { cloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      );
    }

    // Upload multiple images to Cloudinary
    const uploadPromises = files.map(async (file: File) => {
      // Convert File object to base64 string
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;
      
      // Upload to Cloudinary using base64 data
      const result = await cloudinary.uploader.upload(base64String, {
        folder: 'next-uploads',
        // Optional transformation parameters
        // transformation: [{ width: 800, height: 600, crop: 'limit' }]
      });

      return {
        public_id: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height
      } as UploadedImage;
    });

    const uploadResults = await Promise.all(uploadPromises);

    return NextResponse.json({ 
      success: true, 
      images: uploadResults 
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Image upload failed', details: (error as Error).message },
      { status: 500 }
    );
  }
}