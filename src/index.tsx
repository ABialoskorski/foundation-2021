import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "react-query";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: 'http://localhost:8081/',
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

ReactDOM.render(
  <React.StrictMode>
    {/*<ApolloProvider client={client}>*/}
      <QueryClientProvider client={new QueryClient()}>
      <App />
      </QueryClientProvider>
    {/*</ApolloProvider>*/}
  </React.StrictMode>,
  document.getElementById("root"),
);
