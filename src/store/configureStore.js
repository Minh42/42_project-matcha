import reduxThunk from 'redux-thunk';
import rootReducer from '../reducers/index';
import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { setSocket } from '../actions/actionSocket';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const persistConfig = {
    key: 'root',
    storage: storage,
    stateReconciler: autoMergeLevel2,
}

const reducers = persistReducer(persistConfig, rootReducer);

export default function configureStore() {
    const store = createStore(
        reducers,
        compose(
            applyMiddleware(reduxThunk),
            window.devToolsExtension ? window.devToolsExtension() : f => f // initialize devToolsExtension
        )
    ) 

    const socket = setSocket(store.dispatch);
    
    const persistor = persistStore(store);
  
    if (process.env.NODE_ENV !== 'production' && module.hot) {
      // Enable Webpack hot module replacement for reducers
      module.hot.accept('../reducers', () => {
        store.replaceReducer(rootReducer)
      });
    }
  
    return { persistor, store };
}