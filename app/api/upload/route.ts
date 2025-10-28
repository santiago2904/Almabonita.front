import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  console.log('🚀 Upload API called at:', new Date().toISOString());
  console.log('🌍 Environment:', process.env.NODE_ENV);
  
  try {
    // Verificar que Cloudinary esté configurado
    const hasCloudName = !!process.env.CLOUDINARY_CLOUD_NAME;
    const hasApiKey = !!process.env.CLOUDINARY_API_KEY;
    const hasApiSecret = !!process.env.CLOUDINARY_API_SECRET;
    
    console.log('🔧 Cloudinary config check:', {
      hasCloudName,
      hasApiKey,
      hasApiSecret,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME ? `${process.env.CLOUDINARY_CLOUD_NAME.substring(0, 5)}...` : 'undefined'
    });
    
    if (!hasCloudName || !hasApiKey || !hasApiSecret) {
      console.error('❌ Configuración de Cloudinary incompleta');
      return NextResponse.json(
        { error: 'Configuración de Cloudinary incompleta' },
        { status: 500 }
      );
    }

    console.log('📝 Parsing form data...');
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    console.log('📁 File received:', {
      name: file?.name,
      size: file?.size,
      type: file?.type,
      exists: !!file
    });
    
    if (!file) {
      console.error('❌ No file found in form data');
      return NextResponse.json(
        { error: 'No se encontró archivo de imagen' },
        { status: 400 }
      );
    }

    // Validar que sea una imagen
    console.log('🖼️ Validating file type:', file.type);
    if (!file.type.startsWith('image/')) {
      console.error('❌ Invalid file type:', file.type);
      return NextResponse.json(
        { error: 'Solo se permiten archivos de imagen' },
        { status: 400 }
      );
    }

    // Validar tamaño (10MB máximo para Cloudinary)
    console.log('📏 Validating file size:', file.size, 'bytes');
    if (file.size > 10 * 1024 * 1024) {
      console.error('❌ File too large:', file.size);
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. Máximo 10MB' },
        { status: 400 }
      );
    }

    // Convertir archivo a base64 para Cloudinary
    console.log('🔄 Converting file to base64...');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;
    console.log('✅ File converted to base64, length:', base64.length);

    // Configuración para Cloudinary
    const uploadConfig = {
      folder: 'almabonita-ar', // Organizar en carpeta
      public_id: `${Date.now()}-${Math.round(Math.random() * 1E9)}`, // ID único
      resource_type: 'image' as const,
      quality: 'auto', // Optimización automática
      fetch_format: 'auto', // Formato automático
      transformation: [
        { width: 1920, height: 1080, crop: 'limit' }, // Limitar tamaño máximo
        { quality: 'auto:good' } // Calidad optimizada
      ]
    };
    
    console.log('☁️ Uploading to Cloudinary with config:', {
      folder: uploadConfig.folder,
      public_id: uploadConfig.public_id,
      resource_type: uploadConfig.resource_type
    });

    // Subir a Cloudinary
    const result = await cloudinary.uploader.upload(dataUri, uploadConfig);
    
    console.log('🎉 Upload successful! Cloudinary response:', {
      url: result.secure_url,
      public_id: result.public_id,
      size: result.bytes,
      format: result.format,
      width: result.width,
      height: result.height,
      created_at: result.created_at
    });
    
    const response = {
      success: true,
      imageUrl: result.secure_url,
      imagePath: result.secure_url, // Para compatibilidad
      url: result.secure_url, // Añadir url para compatibilidad
      originalName: file.name,
      size: file.size,
      cloudinaryId: result.public_id,
      optimizedSize: result.bytes,
      isCloudinary: true,
      message: 'Imagen subida exitosamente a Cloudinary'
    };
    
    console.log('📤 Sending response:', response);
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('💥 Critical error in upload API:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : typeof error,
      timestamp: new Date().toISOString()
    });
    
    // Log específico para errores de Cloudinary
    if (error && typeof error === 'object' && 'http_code' in error) {
      console.error('☁️ Cloudinary specific error:', {
        http_code: (error as any).http_code,
        message: (error as any).message,
        name: (error as any).name
      });
    }
    
    return NextResponse.json(
      { 
        error: 'Error al subir la imagen',
        details: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}