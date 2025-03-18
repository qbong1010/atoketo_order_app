import Head from 'next/head';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>아토케토 무인 주문 시스템</title>
        <meta name="description" content="아토케토 무인 주문 시스템" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">아토케토 주문 시스템</h1>
            <p className="text-lg text-gray-600">원하는 메뉴와 옵션을 선택하고 주문서를 출력해 보세요</p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Link href="/order" 
                  className="card p-12 text-center hover:border-secondary hover:border-2 flex flex-col items-center justify-center">
              <div className="text-5xl mb-6">🛒</div>
              <h2 className="text-2xl font-bold mb-3">주문하기</h2>
              <p className="text-gray-600">메뉴를 선택하고 주문서 출력하기</p>
            </Link>
            <Link href="/admin" 
                  className="card p-12 text-center hover:border-primary hover:border-2 flex flex-col items-center justify-center">
              <div className="text-5xl mb-6">⚙️</div>
              <h2 className="text-2xl font-bold mb-3">관리자</h2>
              <p className="text-gray-600">메뉴 및 옵션 관리하기</p>
            </Link>
          </div>
          
          <footer className="text-center text-gray-500 mt-12">
            <p>&copy; {new Date().getFullYear()} 아토케토. All rights reserved.</p>
          </footer>
        </div>
      </main>
    </>
  );
} 