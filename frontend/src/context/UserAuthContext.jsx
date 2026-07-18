import PropTypes from "prop-types";
import { createContext, useEffect, useReducer } from "react";

export const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components -- reducer is tightly coupled to AuthContextProvidor, kept in one file
export const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return { user: action.payload }
        case "LOGOUT":
            return { user: null }
        default:
            return state;
    }
}

export const AuthContextProvidor = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        dispatch({ type: "LOGIN", payload: user })
    }, [])

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}

AuthContextProvidor.propTypes = {
    children: PropTypes.node,
};