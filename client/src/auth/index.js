import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from '../api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    GET_LOGGED_IN: "GET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER",
    DISPLAY_ERROR: "DISPLAY_ERROR",
    HIDE_ERROR: "DISPLAY_ERROR"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        errorToDisplay: ""
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
                    errorToDisplay: ""
                })
            }
            case AuthActionType.LOGOUT_USER:{
                return setAuth({
                    user: null,
                    loggedIn:false,
                    errorToDisplay:""
                })
            }
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorToDisplay: ""
                });
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    errorToDisplay: ""
                })
            }
            case AuthActionType.DISPLAY_ERROR:{
                return setAuth({
                    user: null,
                    loggedIn: false,
                    errorToDisplay: payload.errorToDisplay
                })
            }
            case AuthActionType.HIDE_ERROR:{
                return setAuth({
                    user: null,
                    loggedIn: false,
                    errorToDisplay: payload.errorToDisplay
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
        try{
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
            }
        }catch(err){
            auth.displayError(err.response.data.errorMessage);
            //auth.errorToDisplay=err.response.data.errorMessage;
            /*if(response.status==400){
                auth.errorToDisplay=response;
            }*/
        }
    }
    auth.displayError=function(message){
        authReducer({
            type: AuthActionType.DISPLAY_ERROR,
            payload:{
                errorToDisplay: message
            }
        })
    }
    auth.hideError=function(){
        authReducer({
            type: AuthActionType.HIDE_ERROR,
            payload:{
                errorToDisplay: ""
            }
        })
    }
    auth.logoutUser = async function(){
        const resp = await api.logoutUser();
        if(resp.status==200){
            console.log("logged out");
            authReducer({
                type: AuthActionType.LOGOUT_USER,
                payload: {
                    user: null,
                    loggedIn:false
                }
            })
            history.push('/');
        }
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