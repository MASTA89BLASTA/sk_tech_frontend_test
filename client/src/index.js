import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducers from './reducers';
import rootSaga from './sagas';
import Messenger from './components/Messenger';
import './index.css';


try {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(reducers, applyMiddleware(sagaMiddleware));
  sagaMiddleware.run(rootSaga);
  
  ReactDOM.createRoot(document.querySelector("#root")).render(
    <Provider store={store}>
      <Messenger />
    </Provider>,
    
  );
} catch (error) {
  console.log('Error!', error)
}
