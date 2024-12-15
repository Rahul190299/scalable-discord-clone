import cookie from 'cookie';

import { db } from '@/lib/db';
import { NextApiRequest } from 'next';
import { currentProfile } from './current-profile';

export const currentProfilePages = async (req: NextApiRequest) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  const profile = currentProfile(cookies["Set-Cookie"]);
  
  
  return profile;
};
