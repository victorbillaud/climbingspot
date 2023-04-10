import { DictionaryProvider } from '@/components/DictionaryProvider';
import { NavBar } from '@/components/navbar';
import { ToastProvider } from '@/components/ToastProvider';
import { Locale } from '@/i18n';
import { getDictionary } from '@/lib/get-dictionary';
import { logger } from '@supabase/auth-helpers-nextjs';
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
    logger.error(error);
    notFound();
  }

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-white-200 dark:bg-dark-100">
      <DictionaryProvider dictionary={dictionary}>
        <NavBar />
        <div className="w-full h-full overflow-auto">
          <div className="h-full">{children}</div>
        </div>
        <ToastProvider />
      </DictionaryProvider>
    </div>
  );
}
