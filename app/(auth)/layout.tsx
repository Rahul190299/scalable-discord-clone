import { FC, ReactNode } from 'react';
//@ts-ignore
import jwt from 'jsonwebtoken';
import { Navbar } from '@/components/navbar';
import { cn } from '@/lib/utils';
interface layoutProps {
    children: ReactNode;
    user :string
}

const layout: FC<layoutProps> = ({ children }) => {
    
    return (
        <div className=''>
             <Navbar/>
             {children}
        </div>
    );
};



export default layout;
