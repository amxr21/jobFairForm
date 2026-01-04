import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

const link = import.meta.env.VITE_API_URL || "https://jobfairform-backend-production.up.railway.app";

export const useSignUp = () => {
    const [ error, setError ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(null)
    const { dispatch } = useAuthContext();

    const signup = async (email, password) => {
        setIsLoading(true)
        setError(null);
        const response = await fetch(`${link}/user/signup`, {
            method: "POST",
            headers: { "Content-Type" : "application/json" },
            body: JSON.stringify({email, password})
        })

        const json = await response.json();

        if(!response.ok){
            setError(json.error);
            setIsLoading(false)
        }
        if(response.ok){
            localStorage.setItem("user", JSON.stringify(json));
            dispatch({type: "LOGIN", payload: json})
            setIsLoading(false)
        }
    }

    return { signup, isLoading, error };
}