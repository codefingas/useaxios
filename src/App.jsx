import React , {useRef, useReducer, useEffect} from "react";
import axios from 'axios';
// import { useAxiosTs } from "./useAxios";


export function useAxiosJs(url = "", options = {}) {
  const cache = useRef({});
  const cancelRequest = useRef(false);
  

  const initialState = {
      data: undefined,
      error: undefined
  };

  const fetchReducer = (state = initialState, action) => {
      switch (action.type){
          case "loading":
              return {...initialState};
          case "fetched":
              return {...initialState, data: action.payload};
          case "error":
              return {...initialState, data: action.payload };
          default:
              return state;
      }
  }


  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
      if(!url) return;

      const fetchData = async () => {
          dispatch({type: 'loading'});

          if(cache.current[url]) {
              dispatch({type: 'fetched', payload: cache.current[url]});
              return;
          }

          try {
              const response = await axios.get(url);
              cache.current[url] = response.data;

              if (cancelRequest.current) return;
              dispatch({type: 'fetched', payload: response.data});

          }catch(error){
              if(cancelRequest.current) return;
              dispatch({type: 'error', payload: error});
          }

      }

      fetchData();


      return () => {
          cancelRequest.current = true;
      }
  }, [url]);

  return state;
}

const App = () => {
  const { data, error } = useAxiosJs(
    "https://us-east1-serverless-306422.cloudfunctions.net/exchangerates/symbols"
  );

  console.log(
    "recieved data from axios -",
    data,
    "recieved error from axios-",
    error
  );

  return <div className="App"></div>;
};

export default App;