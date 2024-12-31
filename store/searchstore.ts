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