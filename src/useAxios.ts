import { useRef, useEffect, useReducer } from 'react';
import axios from "axios";


interface State<T> {
    data?: T;
    error?: Error;
}

type Cache<T> = { [url: string]: T };

type Action<T> =
    | { type: "loading" }
    | { type: "fetched", payload: T }
    | { type: "error", payload: Error };

export function useAxiosTs<T = unknown>(url?: string, options?: { [key: string]: string }): State<T> {
    const cache = useRef<Cache<T>>({});

    const cancelRequest = useRef<boolean>(false);

    const initialState: State<T> = {
        error: undefined,
        data: undefined
    };


    const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
        switch (action.type) {
            case "loading":
                return { ...initialState };
            case 'fetched':
                return { ...initialState, data: action.payload };
            case 'error':
                return { ...initialState, error: action.payload };
            default:
                return state;
        }
    };


    const [state, dispatch] = useReducer(fetchReducer, initialState);

    useEffect(() => {
        if (!url) return;

        const fetchData = async () => {
            dispatch({ type: 'loading' });

            if (cache.current[url]) {
                dispatch({ type: 'fetched', payload: cache.current[url] });
                return;
            }


            try {
                const response = await axios.get(url);
                cache.current[url] = response.data;

                if (cancelRequest.current) return;
                dispatch({ type: 'fetched', payload: response.data });
            } catch (error) {
                if (cancelRequest.current) return;
                dispatch({ type: 'error', payload: error as Error });
            }
        };

        void fetchData();


        return () => {
            cancelRequest.current = true;
        }
    }, [url])

    return state;

};