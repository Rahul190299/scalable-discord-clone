import { FC } from 'react';
import { initialProfile } from '@/lib/initial-profile';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import InitialModal from '@/components/modals/initial-modal';
import { GetServerSideProps } from 'next';
import { cookies } from 'next/headers'; // To access cookies in server-side component
import { auth } from '@clerk/nextjs';
import Auth from '@/lib/auth';
import jwt from 'jsonwebtoken';
interface setupPageProps {}

const SetupPage: FC<setupPageProps> = async ({}) => {
    const JWT_SECRET = process.env.JWT_SECRET
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    let user = null;
    if(token){
        user = Auth.verifySessionToken(token);
    }
    if(!user){
        redirect('/sign-in');
    }

    console.log("in setup");
    const profile = await initialProfile();
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

