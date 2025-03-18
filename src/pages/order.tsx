import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useReactToPrint } from 'react-to-print';
import { supabase } from '@/lib/supabaseClient';
import { Menu, Option, OrderItem } from '@/types';

export default function Order() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const printRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 메뉴와 옵션 데이터 가져오기
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // 실제 구현에서는 Supabase에서 데이터를 가져오는 코드를 작성합니다
        // 예시 데이터 사용
        const mockMenus: Menu[] = [
          {
            id: 1,
            name: '수비드 비프 포케',
            description: '수비드 방식으로 조리한 비프를 사용한 포케',
            price: 11900,
            imageUrl: '/images/beef-poke.jpg',
            category: 'poke'
          },
          {
            id: 2,
            name: '닭가슴살 포케',
            description: '부드러운 닭가슴살을 사용한 포케',
            price: 10900,
            imageUrl: '/images/chicken-poke.jpg',
            category: 'poke'
          }
        ];
        
        const mockOptions: Option[] = [
          { id: 1, name: '100g', price: 0, type: 'main_topping' },
          { id: 2, name: '200g', price: 3000, type: 'main_topping' },
          { id: 3, name: '사우전아일랜드', price: 0, type: 'sauce' },
          { id: 4, name: '어니언', price: 0, type: 'sauce' },
          { id: 5, name: '오리엔탈', price: 0, type: 'sauce' },
          { id: 6, name: '발사믹', price: 0, type: 'sauce' },
          { id: 7, name: '스리라차마요', price: 0, type: 'sauce' },
          { id: 8, name: '닭가슴살', price: 2000, type: 'additional_topping' },
          { id: 9, name: '수비드비프', price: 3000, type: 'additional_topping' },
          { id: 10, name: '오리훈제', price: 3500, type: 'additional_topping' },
          { id: 11, name: '연어훈제', price: 3500, type: 'additional_topping' },
          { id: 12, name: '버터쉬림프', price: 3000, type: 'additional_topping' },
          { id: 13, name: '올리브', price: 1000, type: 'side_topping' },
          { id: 14, name: '콘', price: 1000, type: 'side_topping' },
          { id: 15, name: '크래미', price: 1500, type: 'side_topping' },
        ];

        setMenus(mockMenus);
        setOptions(mockOptions);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // 주문 항목 추가
  const addToOrder = () => {
    if (!selectedMenu) return;

    const itemPrice = selectedMenu.price;
    const optionsPrice = selectedOptions.reduce((sum, option) => sum + option.price, 0);
    const itemTotalPrice = (itemPrice + optionsPrice) * quantity;

    const newItem: OrderItem = {
      menuId: selectedMenu.id,
      menuName: selectedMenu.name,
      menuPrice: selectedMenu.price,
      quantity,
      options: selectedOptions,
      totalPrice: itemTotalPrice
    };

    setOrderItems([...orderItems, newItem]);
    resetSelection();
    calculateTotal([...orderItems, newItem]);
  };

  // 선택 초기화
  const resetSelection = () => {
    setSelectedMenu(null);
    setSelectedOptions([]);
    setQuantity(1);
  };

  // 총 가격 계산
  const calculateTotal = (items: OrderItem[]) => {
    const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
    setTotalPrice(total);
  };

  // 주문 항목 삭제
  const removeOrderItem = (index: number) => {
    const updatedItems = [...orderItems];
    updatedItems.splice(index, 1);
    setOrderItems(updatedItems);
    calculateTotal(updatedItems);
  };

  // 옵션 선택 토글
  const toggleOption = (option: Option) => {
    // 메인 토핑이나 소스는 하나만 선택 가능
    if (option.type === 'main_topping' || option.type === 'sauce') {
      // 같은 유형의 기존 옵션 제거
      const filteredOptions = selectedOptions.filter(opt => opt.type !== option.type);
      setSelectedOptions([...filteredOptions, option]);
    } else {
      // 이미 선택되어 있으면 제거, 아니면 추가
      if (selectedOptions.some(opt => opt.id === option.id)) {
        setSelectedOptions(selectedOptions.filter(opt => opt.id !== option.id));
      } else {
        setSelectedOptions([...selectedOptions, option]);
      }
    }
  };

  // 옵션 필터링
  const filterOptionsByType = (type: string) => {
    return options.filter(option => option.type === type);
  };

  // 선택 여부 확인
  const isOptionSelected = (optionId: number) => {
    return selectedOptions.some(option => option.id === optionId);
  };

  // 주문서 출력 처리
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: () => {
      // 주문 기록 저장 (필요한 경우)
      alert('주문서가 출력되었습니다. 카운터에 가져가 결제를 진행해주세요.');
      resetOrder();
    },
  });

  // 주문 초기화
  const resetOrder = () => {
    setOrderItems([]);
    setTotalPrice(0);
    resetSelection();
  };

  // 가격 포맷팅
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">로딩 중...</div>;
  }

  return (
    <>
      <Head>
        <title>메뉴 주문 | 아토케토 무인 주문 시스템</title>
        <meta name="description" content="아토케토 메뉴 주문" />
      </Head>
      <main className="min-h-screen p-4 md:p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-primary">메뉴 주문</h1>
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-primary"
              >
                &larr; 홈으로
              </button>
            </div>
            <p className="text-gray-600 mt-2">원하는 메뉴와 옵션을 선택하세요</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 메뉴 선택 영역 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">메뉴 선택</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menus.map((menu) => (
                    <div
                      key={menu.id}
                      className={`card cursor-pointer ${
                        selectedMenu?.id === menu.id ? 'border-2 border-secondary' : ''
                      }`}
                      onClick={() => setSelectedMenu(menu)}
                    >
                      <div className="h-40 bg-gray-200 rounded-t-lg mb-4">
                        {/* 실제 구현에서는 이미지 추가 */}
                      </div>
                      <h3 className="font-semibold text-lg">{menu.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{menu.description}</p>
                      <p className="font-medium text-secondary">{formatPrice(menu.price)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedMenu && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">옵션 선택</h2>
                  
                  {/* 메인 토핑 옵션 */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-700 mb-2">메인 토핑 양 (필수)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {filterOptionsByType('main_topping').map((option) => (
                        <div
                          key={option.id}
                          className={`rounded-md p-3 border cursor-pointer ${
                            isOptionSelected(option.id)
                              ? 'bg-secondary/10 border-secondary'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => toggleOption(option)}
                        >
                          <div className="flex justify-between items-center">
                            <span>{option.name}</span>
                            {option.price > 0 && (
                              <span className="text-sm text-secondary">+{formatPrice(option.price)}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 소스 옵션 */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-700 mb-2">소스 선택 (필수)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {filterOptionsByType('sauce').map((option) => (
                        <div
                          key={option.id}
                          className={`rounded-md p-3 border cursor-pointer ${
                            isOptionSelected(option.id)
                              ? 'bg-secondary/10 border-secondary'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => toggleOption(option)}
                        >
                          <div className="flex justify-between items-center">
                            <span>{option.name}</span>
                            {option.price > 0 && (
                              <span className="text-sm text-secondary">+{formatPrice(option.price)}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 추가 토핑 옵션 */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-700 mb-2">메인 토핑 추가 (선택)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {filterOptionsByType('additional_topping').map((option) => (
                        <div
                          key={option.id}
                          className={`rounded-md p-3 border cursor-pointer ${
                            isOptionSelected(option.id)
                              ? 'bg-secondary/10 border-secondary'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => toggleOption(option)}
                        >
                          <div className="flex justify-between items-center">
                            <span>{option.name}</span>
                            {option.price > 0 && (
                              <span className="text-sm text-secondary">+{formatPrice(option.price)}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 사이드 토핑 옵션 */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-700 mb-2">사이드 토핑 추가 (선택)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {filterOptionsByType('side_topping').map((option) => (
                        <div
                          key={option.id}
                          className={`rounded-md p-3 border cursor-pointer ${
                            isOptionSelected(option.id)
                              ? 'bg-secondary/10 border-secondary'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => toggleOption(option)}
                        >
                          <div className="flex justify-between items-center">
                            <span>{option.name}</span>
                            {option.price > 0 && (
                              <span className="text-sm text-secondary">+{formatPrice(option.price)}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 수량 선택 */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-700 mb-2">수량</h3>
                    <div className="flex items-center">
                      <button
                        className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </button>
                      <span className="mx-4 font-medium text-lg">{quantity}</span>
                      <button
                        className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      className="btn btn-secondary"
                      onClick={resetSelection}
                    >
                      취소
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={addToOrder}
                      disabled={
                        !selectedOptions.some(option => option.type === 'main_topping') ||
                        !selectedOptions.some(option => option.type === 'sauce')
                      }
                    >
                      장바구니에 추가
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 주문 요약 영역 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4">주문 내역</h2>
                
                {orderItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">장바구니가 비어있습니다</p>
                ) : (
                  <>
                    <div className="mb-4 max-h-80 overflow-y-auto">
                      {orderItems.map((item, index) => (
                        <div key={index} className="border-b pb-3 mb-3">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium">{item.menuName}</h3>
                              <p className="text-sm text-gray-600">
                                {item.options
                                  .map(option => option.name)
                                  .join(', ')}
                              </p>
                              <p className="text-sm">수량: {item.quantity}</p>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="font-medium">{formatPrice(item.totalPrice)}</span>
                              <button
                                className="text-xs text-red-500 mt-1"
                                onClick={() => removeOrderItem(index)}
                              >
                                삭제
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-6">
                        <span className="font-semibold">총 금액:</span>
                        <span className="text-xl font-bold text-secondary">{formatPrice(totalPrice)}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          className="btn btn-secondary"
                          onClick={resetOrder}
                        >
                          전체 취소
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={handlePrint}
                          disabled={orderItems.length === 0}
                        >
                          주문서 출력
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 출력용 주문서 (화면에는 보이지 않음) */}
      <div style={{ display: 'none' }}>
        <div ref={printRef} className="p-8">
          <h1 className="text-3xl font-bold text-center mb-6">아토케토 주문서</h1>
          <p className="text-center mb-8">주문번호: {new Date().getTime().toString().slice(-6)}</p>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3 border-b pb-2">주문 내역</h2>
            {orderItems.map((item, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{item.menuName} x {item.quantity}</span>
                  <span>{formatPrice(item.menuPrice * item.quantity)}</span>
                </div>
                {item.options.map(option => (
                  <div key={option.id} className="flex justify-between pl-4 text-sm">
                    <span>{option.name}</span>
                    {option.price > 0 && <span>+{formatPrice(option.price * item.quantity)}</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">총 금액:</span>
              <span className="text-2xl font-bold">{formatPrice(totalPrice)}</span>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p>주문일시: {new Date().toLocaleString('ko-KR')}</p>
            <p className="mt-8">이 주문서를 카운터에 제시해 주세요.</p>
          </div>
        </div>
      </div>
    </>
  );
} 