
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { AppbarAuth } from './appbarauth';
//@ts-ignore
import Cookies from 'js-cookie';
import Auth from '@/lib/auth';
import ThemeToggler from './ThemeToggler';

export const Navbar = () => {
 
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  //const cookieStore = cookies();
  const token = Cookies.get('token')?.value;
    let user = null;
    if(token){
        user = Auth.verifySessionToken(token);
    }
    

  // Memoizing the toggleMenu and toggleSearch functions
  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);
  const toggleSearch = useCallback(() => setIsSearchOpen((prev) => !prev), []);

  // Memoizing the navItemVariants object
  const navItemVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: -20 },
      visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: i * 0.1,
          duration: 0.5,
          ease: [0.43, 0.13, 0.23, 0.96],
        },
      }),
    }),
    [],
  );

  return (
    <AnimatePresence>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          type: 'spring',
          damping: 10,
          stiffness: 100,
        }}
        className="fixed h-1/12  w-full border-b border-primary/10 bg-background"
      >
        <div className="wrapper flex w-full items-center justify-between p-3">
          
        <motion.div
            className="flex items-center gap-4"
            initial="hidden"
            animate="visible"
            variants={navItemVariants}
            custom={0}
          >
            {user && pathname !== '/home' && (
              <Button
                onClick={() => router.back()}
                variant={'ghost'}
                size={'icon'}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="size-6" />
              </Button>
            )}
            <Link href={'/'} className="flex items-center gap-2">
              <img
                src={
                  'https://logos-world.net/wp-content/uploads/2020/12/Discord-Emblem.png'
                }
                alt="100xDevs Logo"
                className="w-1/12"
              />
              <p
                className={`hidden bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text text-2xl font-black tracking-tighter text-transparent min-[375px]:block`}
              >
                Discord
              </p>
            </Link>
          </motion.div>

          <motion.div
            className="flex items-center gap-4"
            initial="hidden"
            animate="visible"
            variants={navItemVariants}
            custom={1}
          >
           
           <ThemeToggler />

            {!user && (
              <>
                <Button
                  onClick={toggleMenu}
                  variant={'ghost'}
                  size={'icon'}
                  className="md:hidden"
                >
                  <Menu className="size-6" />
                </Button>
                <div className="hidden items-center gap-2 md:flex">
                  <AppbarAuth />
                  
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* Mobile menu */}
        
      </motion.nav>

      {/* Mobile search overlay */}
      
    </AnimatePresence>
  );
};
