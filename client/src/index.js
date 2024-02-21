import * as React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import reducers from "./reducers";
import rootSaga from "./sagas";
import Messenger from "./components/Messenger";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
// import './index.css';

const theme = createTheme({
  typography: {
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
    code: {
      fontFamily: `'source-code-pro', 'Menlo', 'Monaco', 'Consolas', 'Courier New', monospace`,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          lineHeight: '1.2 !important',
        },
        code: {
          fontFamily: `'source-code-pro', 'Menlo', 'Monaco', 'Consolas', 'Courier New', monospace`,
        },
      },
    },
  },
});

try {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(reducers, applyMiddleware(sagaMiddleware));
  sagaMiddleware.run(rootSaga);

  ReactDOM.createRoot(document.querySelector("#root")).render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Messenger />
      </ThemeProvider>
    </Provider>
  );
} catch (error) {
  console.log("Error!", error);
}
