'use client';
import { Button } from './ui/button';
//@ts-ignore
import Cookies from "js-cookie";
import Auth from '@/lib/auth';
import { redirect } from 'next/navigation';
export const AppbarAuth = () => {
  
  //const cookieStore = cookies();
  const token = Cookies.get('token')?.value;
    let user = null;
    if(token){
        user = Auth.verifySessionToken(token);
    }
    

    const signIn = () => {
      redirect('/sign-in');
    }

  return (
    !user && (
      <Button
        onClick={() => {
          signIn();
        }}
      >
        Login
      </Button>
    )
  );
};