import {create} from 'zustand';

interface searchStoreInterface {
    showSearchPane : boolean,
    setShowSearchPane : (showSearchPane : boolean) => void,
    searchText : string,
    setSearchText : (searchText : string) => void,
}

export const useSearchStore = create<searchStoreInterface>((set) => ({
    showSearchPane : false,
    setShowSearchPane : (showSearchPane) => set({showSearchPane : showSearchPane}),
    searchText : "",
    setSearchText : (searchText) => set({searchText : searchText}),
}))

interface searchMessagesStoreInterface {
    searchMessagesCount : number,
    setSearchMessagesCount : (searchMessagesCount : number) => void,
    searchingMessages : boolean,
    setSearchingMessages : (searchingMessages : boolean) => void,

}

export const useSearchMessagesStore = create<searchMessagesStoreInterface>((set) => ({
    searchMessagesCount : 0,
    setSearchMessagesCount : (searchMessagesCount) => set({searchMessagesCount : searchMessagesCount}),
    searchingMessages : false,
    setSearchingMessages : (searchingMessages) => set({searchingMessages : searchingMessages}),

}));