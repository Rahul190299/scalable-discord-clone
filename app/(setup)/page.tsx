import { FC } from 'react';
import { initialProfile } from '@/lib/initial-profile';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import InitialModal from '@/components/modals/initial-modal';
import { cookies } from 'next/headers'; // To access cookies in server-side component
import cookie from 'cookie';
import Auth from '@/lib/auth';
interface setupPageProps {}

const SetupPage: FC<setupPageProps> = async ({}) => {
    
   
    const cookieStore = cookies();
    const cookieString = cookieStore.get('Set-Cookie')?.value;
    let user = null;
    if(cookieString){
        const parsedCookies = cookie.parse(cookieString || '');
        user = Auth.verifySessionToken(parsedCookies.token);
        
    }
    if(!user){
        redirect('/sign-in');
    }

    console.log("in setup");
    const profile = await initialProfile(user.id);
    if(!profile){
        redirect('/sign-in');
    }
    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    });

    if (server) {
        return redirect(`/servers/${server.id}`);
    }

    return <InitialModal />;
};

export default SetupPage;

