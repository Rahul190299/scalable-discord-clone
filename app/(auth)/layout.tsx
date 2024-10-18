import { FC, ReactNode } from 'react';
//@ts-ignore
import jwt from 'jsonwebtoken';

interface layoutProps {
    children: ReactNode;
    user :string
}

const layout: FC<layoutProps> = ({ children }) => {
    
    return (
        <div className="h-full flex items-center justify-center">
            {children}
        </div>
    );
};



export default layout;
