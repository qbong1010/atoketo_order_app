import { supabase } from '@/lib/supabase';
import { CreateMenuDto, Menu } from '@/types/menu';

export const menuService = {
  async createMenu(data: CreateMenuDto): Promise<Menu> {
    // 1. 이미지 업로드
    let imageUrl = '';
    if (data.image) {
      const fileName = `menu-images/${Date.now()}-${data.image.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, data.image);

      if (uploadError) throw new Error('이미지 업로드 실패');
      
      // 이미지 URL 생성
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);
      
      imageUrl = publicUrl;
    }

    // 2. 메뉴 데이터 저장
    const { data: menu, error } = await supabase
      .from('menus')
      .insert([{
        name: data.name,
        description: data.description,
        base_price: data.basePrice,
        default_sauce: data.defaultSauce,
        is_available: data.isAvailable,
        image_url: imageUrl
      }])
      .select()
      .single();

    if (error) throw new Error('메뉴 생성 실패');
    return menu;
  },

  async optimizeImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const optimizedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(optimizedFile);
              } else {
                reject(new Error('이미지 최적화 실패'));
              }
            },
            'image/jpeg',
            0.8
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
  }
}; 