import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Menu } from '@/types';

interface MenuFormProps {
  onSubmit: (data: Omit<Menu, 'id'>) => Promise<void>;
  onCancel: () => void;
  initialData?: Menu;
}

export default function MenuForm({ onSubmit, onCancel, initialData }: MenuFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Omit<Menu, 'id'>>({
    defaultValues: initialData
  });
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          메뉴명
        </label>
        <input
          type="text"
          {...register('name', { required: '메뉴명을 입력해주세요' })}
          className="w-full p-2 border rounded-md"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          설명
        </label>
        <textarea
          {...register('description')}
          className="w-full p-2 border rounded-md h-24"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          가격
        </label>
        <input
          type="number"
          {...register('price', { 
            required: '가격을 입력해주세요',
            min: { value: 0, message: '가격은 0 이상이어야 합니다' }
          })}
          className="w-full p-2 border rounded-md"
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          카테고리
        </label>
        <select
          {...register('category', { required: '카테고리를 선택해주세요' })}
          className="w-full p-2 border rounded-md"
        >
          <option value="">카테고리 선택</option>
          <option value="poke">포케</option>
          <option value="dosirak">도시락</option>
          <option value="side">사이드</option>
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          메뉴 이미지
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border rounded-md"
        />
        {imagePreview && (
          <div className="mt-2">
            <img 
              src={imagePreview} 
              alt="미리보기" 
              className="w-32 h-32 object-cover rounded-md"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md hover:bg-gray-100"
        >
          취소
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          저장
        </button>
      </div>
    </form>
  );
} 