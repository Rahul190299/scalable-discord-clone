import {create} from 'zustand';

interface userStore  {
    session : string,
    setSession : (session : string) => void;
    userId : string,
    setUserId : (userId : string) => void,
    email : string,
    setEmail : (email : string) => void,
}

export const useSessionStore = create<userStore>((set) => ({
    session : "",
    setSession : (session) => set({session : session}),
    userId : "",
    setUserId : (userId) => set({userId : userId}),
    email : "",
    setEmail : (email) => set({email : email}),
}))

interface pageStore{
    currentPage : number,
    setCurrentPage : (currentPage : number) => void,
}

export const usePageStore = create<pageStore>((set) => ({
    currentPage : 0,
    setCurrentPage : (currentPage) =>set({currentPage : currentPage}),
}));