import reduxThunk from 'redux-thunk';
import rootReducer from '../reducers/index';
import { createStore, applyMiddleware, compose } from 'redux';
import { loadState, saveState } from '../../library/localStorage';

export default function configureStore() {
    const persistedState = loadState();
    const store = createStore(
        rootReducer,
        persistedState,
        compose(
            applyMiddleware(reduxThunk),
            window.devToolsExtension ? window.devToolsExtension() : f => f // initialize devToolsExtension
        )
    )   
  
    if (process.env.NODE_ENV !== 'production' && module.hot) {
      // Enable Webpack hot module replacement for reducers
      module.hot.accept('../reducers', () => {
        store.replaceReducer(rootReducer)
      });
    }
  
    return store;
}