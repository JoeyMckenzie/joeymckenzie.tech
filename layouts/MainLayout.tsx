import { FC } from 'react';
import Navbar from '@/components/Navbar';

const MainLayout: FC = ({ children }) => (
  <>
    <Navbar />

    <div className="min-h-full">
      <header className="bg-white dark:bg-gray-900 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">
            Dashboard
          </h1>
        </div>
      </header>
      <main className="dark:bg-gray-800">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Replace with your content */}
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 dark:border-gray-900 rounded-lg h-96">
              {children}
            </div>
          </div>
          {/* /End replace */}
        </div>
      </main>
    </div>
  </>
);

export default MainLayout;
