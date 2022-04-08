import React, { createContext, Dispatch } from 'react'

interface AuthState {
    userInfo: {
        id: number | string,
        name: string,
        email: string,
        token: string,
        friends: any
    };

    isLoggedIn: boolean;
}

interface AuthType {
    data: any[];
    type: string;
    isloggin: boolean;
};

interface SearchType {
    type: string;
    data: string;
};
interface SearchState {
    value: string;
}



export interface InitContextProps {
    state: AuthState;
    setState: Dispatch<Partial<AuthType>>;
    searchstate: SearchState;
    setSearchState: Dispatch<Partial<SearchType>>;

}

export const dataInit = {
    userInfo: {
        id: 0,
        name: '',
        email: '',
        token: '',
        friends: '[]'
    },
    isLoggedIn: sessionStorage.getItem('token') ? true : false,
    searchValue: '',
};

export const searchvalueInit: SearchState = {
    value: ''
}

export const Authreducer = (authState: AuthState, action: Partial<AuthType>): any | unknown => {
    switch (action.type) {
        case "LOGIN":
            // console.log("context action.data", action.isloggin);

            return { ...authState, userInfo: action.data, isLoggedIn: action.isloggin };

        case "LOGOUT":
            return { ...authState, isLoggedIn: false };

        case "SEARCH":
            return { ...authState, searchValue: action.data };

        default:
            return authState;
    }




};

export const Searchreducer = (searchState: SearchState, action: Partial<SearchType>): any | unknown => {
    switch (action.type) {
        case "SEARCH":
            return { value: action.data };
        default:
            return searchState;

    }
}



const MyContext = createContext<InitContextProps>({
    state: dataInit,
    searchstate: searchvalueInit,
    setState: () => {
        throw new Error("setState not implemented");
    },
    setSearchState: () => {
        throw new Error("setState not implemented");
    }
});




export default MyContext