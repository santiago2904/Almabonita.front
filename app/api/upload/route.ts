import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // Verificar que Cloudinary esté configurado
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: 'Configuración de Cloudinary incompleta' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No se encontró archivo de imagen' },
        { status: 400 }
      );
    }

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Solo se permiten archivos de imagen' },
        { status: 400 }
      );
    }

    // Validar tamaño (10MB máximo para Cloudinary)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. Máximo 10MB' },
        { status: 400 }
      );
    }

    // Convertir archivo a base64 para Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    // Subir a Cloudinary
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'almabonita-ar', // Organizar en carpeta
      public_id: `${Date.now()}-${Math.round(Math.random() * 1E9)}`, // ID único
      resource_type: 'image',
      quality: 'auto', // Optimización automática
      fetch_format: 'auto', // Formato automático
      transformation: [
        { width: 1920, height: 1080, crop: 'limit' }, // Limitar tamaño máximo
        { quality: 'auto:good' } // Calidad optimizada
      ]
    });
    
    console.log('📸 Imagen subida a Cloudinary:', {
      url: result.secure_url,
      public_id: result.public_id,
      size: result.bytes
    });
    
    return NextResponse.json({
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
    });
    
  } catch (error) {
    console.error('❌ Error subiendo a Cloudinary:', error);
    return NextResponse.json(
      { 
        error: 'Error al subir la imagen',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}