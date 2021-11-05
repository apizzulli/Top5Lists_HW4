import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from '../api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    LOGIN_USER: "LOGIN_USER",
    GET_LOGGED_IN: "GET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        errorToDisplay: null
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.LOGIN_USER:{
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    errorToDisplay: null
                })
            }
            case AuthActionType.LOGOUT_USER:{
                return setAuth({
                    user: null,
                    loggedIn:false,
                    errorToDisplay:null
                })
            }
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorToDisplay: null
                });
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    errorToDisplay: null
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }
    auth.registerUser = async function(userData, store) {
        const response = await api.registerUser(userData);      
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.REGISTER_USER,
                payload: {
                    user: response.data.user
                }
            })
            history.push("/");
            store.loadIdNamePairs();
        }
    }
    auth.loginUser = async function(userData, store){
        const response = await api.loginUser(userData);
        if(response.status==200){
            console.log("succeeded in calling api.loginUser");
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: response.data.user
                }
            })
            history.push("/");
            store.loadIdNamePairs();
        }else{
            console.log("error");
            if(response.status==400){
                auth.errorToDisplay=response;
            }
        }
    }
    auth.logoutUser = function(){
        authReducer({
            type: AuthActionType.LOGOUT_USER,
            payload:{
                loggedIn:false
            }
        })
        history.push('/');
    }
    

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };