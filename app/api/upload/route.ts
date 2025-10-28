import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
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

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. Máximo 5MB' },
        { status: 400 }
      );
    }

    // Generar nombre único
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${fileExtension}`;
    
    // Guardar en public/uploads
    const uploadPath = join(process.cwd(), 'public/uploads', uniqueName);
    await writeFile(uploadPath, buffer);
    
    const imagePath = `/uploads/${uniqueName}`;
    
    console.log('📸 Imagen subida:', imagePath);
    
    return NextResponse.json({
      success: true,
      imagePath: imagePath,
      originalName: file.name,
      size: file.size,
      isNgrok: false
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}