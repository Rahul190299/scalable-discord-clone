'use client';
import { Button } from './ui/button';
//@ts-ignore
import Cookies from "js-cookie";
import Auth from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';
export const AppbarAuth = () => {
  
  //const cookieStore = cookies();
  const pathName = usePathname();
  const router = useRouter();
  console.log(pathName);
  const token = Cookies.get('token')?.value;
    let user = null;
    if(token){
        user = Auth.verifySessionToken(token);
    }
    

    const signIn = () => {
      if(pathName === "/sign-up"){
        router.push('/sign-in');
      }
      else{
        router.push('/sign-up');
      }
      
    }

  return (
    !user && (
      <Button
        onClick={() => {
          signIn();
        }}
      >
        {pathName === "/sign-up" ? "Login" : "Signup"}
        
      </Button>
    )
  );
};