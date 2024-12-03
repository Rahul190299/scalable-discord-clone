import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { cookies } from 'next/headers'; // To access cookies in server-side component
import cookie from 'cookie';
import Auth from '@/lib/auth';

const f = createUploadthing();

const handleAuth = () => {
    const cookieStore = cookies();
    const cookieString = cookieStore.get('Set-Cookie')?.value;
    let user = null;
    if(cookieString){
        const parsedCookies = cookie.parse(cookieString || '');
        user = Auth.verifySessionToken(parsedCookies.token);
        
    }
    if (!user || !user.id) throw new Error('unauth');
    const userId = user.id;
    return { userId };
};

export const ourFileRouter = {
    
    serverImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
    messageFile: f(['image', 'pdf'])
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
