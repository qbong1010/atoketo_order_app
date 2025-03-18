import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import { Menu, Option } from '@/types';
import MenuModal from '@/components/MenuModal';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'menus' | 'options'>('menus');
  const [menus, setMenus] = useState<Menu[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  
  const router = useRouter();

  // 비밀번호 확인 (실제 구현에서는 보안을 강화해야 합니다)
  const checkPassword = () => {
    // 임시로 간단한 비밀번호 확인
    if (password === 'admin1234') {
      setIsAuthenticated(true);
      localStorage.setItem('isAdminAuthenticated', 'true');
    } else {
      alert('잘못된 비밀번호입니다.');
    }
  };

  // 실제 구현에서는 세션 검증 등의 보안 기능을 추가해야 합니다
  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('isAdminAuthenticated');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, []);

  // Supabase 연동을 위한 데이터 가져오기 함수 수정
  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchData() {
      setIsLoading(true);
      try {
        // Supabase에서 실제 데이터 가져오기
        const { data: menuData, error: menuError } = await supabase
          .from('menus')
          .select('*')
          .order('created_at', { ascending: false });

        if (menuError) throw menuError;
        setMenus(menuData || []);

        const { data: optionData, error: optionError } = await supabase
          .from('options')
          .select('*')
          .order('type', { ascending: true });

        if (optionError) throw optionError;
        setOptions(optionData || []);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
        alert('데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [isAuthenticated]);

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    setIsAuthenticated(false);
  };

  // 가격 포맷팅
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  // 새 메뉴 저장 함수 수정
  const handleSaveMenu = async (menuData: Omit<Menu, 'id'>) => {
    try {
      setIsLoading(true);
      
      let imageUrl = '';
      
      // 이미지가 있는 경우 Storage에 업로드
      if (menuData.imageUrl) {
        const file = menuData.imageUrl as unknown as File;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `menu-images/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 이미지 URL 가져오기
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      // 메뉴 데이터 저장
      const { data, error } = await supabase
        .from('menus')
        .insert([{
          name: menuData.name,
          description: menuData.description,
          price: menuData.price,
          category: menuData.category,
          image_url: imageUrl,
          is_available: true
        }])
        .select()
        .single();

      if (error) throw error;

      setMenus([data, ...menus]);
      setIsMenuModalOpen(false);
      alert('메뉴가 성공적으로 추가되었습니다.');
    } catch (error) {
      console.error('메뉴 저장 중 오류 발생:', error);
      alert('메뉴 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 메뉴 삭제
  const handleDeleteMenu = async (menuId: number) => {
    if (!confirm('정말로 이 메뉴를 삭제하시겠습니까?')) return;
    
    try {
      // 실제 구현에서는 Supabase에서 삭제하는 코드로 대체합니다
      console.log('메뉴 삭제:', menuId);
      
      // 목업 삭제
      setMenus(menus.filter(menu => menu.id !== menuId));
      alert('메뉴가 삭제되었습니다.');
    } catch (error) {
      console.error('메뉴 삭제 중 오류 발생:', error);
      alert('메뉴 삭제에 실패했습니다.');
    }
  };

  // 새 옵션 저장
  const handleSaveOption = async (option: Option) => {
    try {
      // 실제 구현에서는 Supabase에 저장하는 코드로 대체합니다
      console.log('옵션 저장:', option);
      
      // 목업 저장
      if (option.id) {
        // 기존 옵션 수정
        setOptions(options.map(o => o.id === option.id ? option : o));
      } else {
        // 새 옵션 추가
        const newOption = {
          ...option,
          id: Math.max(...options.map(o => o.id), 0) + 1
        };
        setOptions([...options, newOption]);
      }
      
      alert('옵션이 저장되었습니다.');
    } catch (error) {
      console.error('옵션 저장 중 오류 발생:', error);
      alert('옵션 저장에 실패했습니다.');
    }
  };

  // 옵션 삭제
  const handleDeleteOption = async (optionId: number) => {
    if (!confirm('정말로 이 옵션을 삭제하시겠습니까?')) return;
    
    try {
      // 실제 구현에서는 Supabase에서 삭제하는 코드로 대체합니다
      console.log('옵션 삭제:', optionId);
      
      // 목업 삭제
      setOptions(options.filter(option => option.id !== optionId));
      alert('옵션이 삭제되었습니다.');
    } catch (error) {
      console.error('옵션 삭제 중 오류 발생:', error);
      alert('옵션 삭제에 실패했습니다.');
    }
  };

  // 옵션 유형별 필터링
  const filterOptionsByType = (type: 'main_topping' | 'sauce' | 'additional_topping' | 'side_topping') => {
    return options.filter(option => option.type === type);
  };

  if (isLoading && isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">로딩 중...</div>;
  }

  return (
    <>
      <Head>
        <title>관리자 | 아토케토 무인 주문 시스템</title>
        <meta name="description" content="아토케토 관리자 페이지" />
      </Head>
      <main className="min-h-screen p-4 md:p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {!isAuthenticated ? (
            // 로그인 화면
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 mt-20">
              <h1 className="text-2xl font-bold text-center mb-6">관리자 로그인</h1>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="password">비밀번호</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="관리자 비밀번호를 입력하세요"
                />
              </div>
              <button
                onClick={checkPassword}
                className="w-full btn btn-primary"
              >
                로그인
              </button>
              <div className="text-center mt-4">
                <button
                  onClick={() => router.push('/')}
                  className="text-gray-500 hover:text-primary"
                >
                  홈으로 돌아가기
                </button>
              </div>
            </div>
          ) : (
            // 관리자 화면
            <>
              <header className="mb-8">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold text-primary">관리자 페이지</h1>
                  <div>
                    <button
                      onClick={() => router.push('/')}
                      className="text-gray-600 hover:text-primary mr-4"
                    >
                      홈으로
                    </button>
                    <button
                      onClick={handleLogout}
                      className="text-red-500 hover:text-red-700"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              </header>

              {/* 탭 내비게이션 */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex">
                  <button
                    className={`py-4 px-6 font-medium text-sm ${
                      activeTab === 'menus'
                        ? 'border-b-2 border-secondary text-secondary'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('menus')}
                  >
                    메뉴 관리
                  </button>
                  <button
                    className={`py-4 px-6 font-medium text-sm ${
                      activeTab === 'options'
                        ? 'border-b-2 border-secondary text-secondary'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('options')}
                  >
                    옵션 관리
                  </button>
                </nav>
              </div>

              {activeTab === 'menus' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">메뉴 목록</h2>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setIsMenuModalOpen(true)}
                    >
                      새 메뉴 추가
                    </button>
                  </div>

                  {/* 메뉴 리스트 */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            이미지
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            메뉴명
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            설명
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            가격
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            카테고리
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            관리
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {menus.map((menu) => (
                          <tr key={menu.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="h-16 w-16 bg-gray-200 rounded">
                                {/* 이미지가 있으면 표시 */}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{menu.name}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-500 max-w-xs truncate">{menu.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatPrice(menu.price)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{menu.category}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-secondary hover:text-secondary-dark mr-3">
                                수정
                              </button>
                              <button 
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDeleteMenu(menu.id)}
                              >
                                삭제
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'options' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">옵션 관리</h2>
                    <button className="btn btn-primary">
                      새 옵션 추가
                    </button>
                  </div>

                  {/* 옵션 유형별 탭 */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-700 mb-4">메인 토핑 옵션</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              옵션명
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              추가 가격
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              관리
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filterOptionsByType('main_topping').map((option) => (
                            <tr key={option.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{option.name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{formatPrice(option.price)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-secondary hover:text-secondary-dark mr-3">
                                  수정
                                </button>
                                <button 
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDeleteOption(option.id)}
                                >
                                  삭제
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-medium text-gray-700 mb-4">소스 옵션</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              옵션명
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              추가 가격
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              관리
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filterOptionsByType('sauce').map((option) => (
                            <tr key={option.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{option.name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{formatPrice(option.price)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-secondary hover:text-secondary-dark mr-3">
                                  수정
                                </button>
                                <button 
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDeleteOption(option.id)}
                                >
                                  삭제
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-medium text-gray-700 mb-4">추가 메인 토핑 옵션</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              옵션명
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              추가 가격
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              관리
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filterOptionsByType('additional_topping').map((option) => (
                            <tr key={option.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{option.name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{formatPrice(option.price)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-secondary hover:text-secondary-dark mr-3">
                                  수정
                                </button>
                                <button 
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDeleteOption(option.id)}
                                >
                                  삭제
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700 mb-4">사이드 토핑 옵션</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              옵션명
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              추가 가격
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              관리
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filterOptionsByType('side_topping').map((option) => (
                            <tr key={option.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{option.name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{formatPrice(option.price)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-secondary hover:text-secondary-dark mr-3">
                                  수정
                                </button>
                                <button 
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDeleteOption(option.id)}
                                >
                                  삭제
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* 메뉴 추가/수정 모달 */}
      <MenuModal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        onSave={handleSaveMenu}
      />
    </>
  );
} 