import {create} from 'zustand';

interface userStore  {
    session : string,
    setSession : (session : string) => void;
}

export const useSession = create<userStore>((set) => ({
    session : "",
    setSession : (session) => set({session : session})
}))
