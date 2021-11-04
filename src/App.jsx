import React from "react";
import { useAxiosTs } from "./useAxios";

const App = () => {
  const { data, error } = useAxiosTs(
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
