import { Dialog } from '@headlessui/react';
import MenuForm from './MenuForm';
import { Menu } from '@/types';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (menuData: Omit<Menu, 'id'>) => Promise<void>;
  menu?: Menu;
}

export default function MenuModal({ isOpen, onClose, onSave, menu }: MenuModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-3xl w-full bg-white rounded-lg shadow-xl">
          <div className="flex justify-between items-center p-6 border-b">
            <Dialog.Title className="text-xl font-semibold">
              {menu ? '메뉴 수정' : '새 메뉴 추가'}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">닫기</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6">
            <MenuForm 
              onSubmit={onSave} 
              onCancel={onClose}
              initialData={menu}
            />
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 