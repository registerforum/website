import { ReactNode } from 'react';
import Header from '@/components/header';

interface LayoutProps {
    children: ReactNode;
    search: boolean;
    className?: string;
}

export default function Layout({ 
    children,
    search = true,
    className
}: LayoutProps) {
    return (
        <main className={className}>
            <Header search={search}/>
            {children}
            {/* <footer>
                <p>Footer</p>
            </footer> */}
        </main>
    );
}