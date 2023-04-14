import { DictionaryProvider } from '@/components/DictionaryProvider';
import { NavBar } from '@/components/navbar';
import { SearchBackground } from '@/components/SearchBackground';
import { ToastProvider } from '@/components/ToastProvider';
import { Locale } from '@/i18n';
import { getDictionary } from '@/lib/get-dictionary';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import 'react-toastify/dist/ReactToastify.css';

interface IProps {
  children: ReactNode;
  params: { lang: Locale };
}

export default async function RootLayout({ children, params }: IProps) {
  let dictionary: Awaited<ReturnType<typeof getDictionary>>;
  try {
    dictionary = await getDictionary(params.lang);
  } catch (error) {
    notFound();
  }

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-white-200 dark:bg-dark-100">
      <DictionaryProvider dictionary={dictionary}>
        <NavBar />
        <div className="relative w-full h-full overflow-auto">
          <SearchBackground />
          {children}
        </div>
        <ToastProvider />
      </DictionaryProvider>
    </div>
  );
}
