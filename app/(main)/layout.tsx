import NavigationSidebar from '@/components/navigation/navigation-sidebar';
import { FC, ReactNode } from 'react';

interface mainLayoutProps {
    children: ReactNode;
}

const MainLayout: FC<mainLayoutProps> = ({ children }) => {
    return (
        <div className="h-screen ">
            <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
                <NavigationSidebar />
            </div>
            <main className="md:pl-[72px] h-screen border-yellow-500 border-2">{children}</main>
        </div>
    );
};

export default MainLayout;
