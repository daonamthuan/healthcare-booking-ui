import { logger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";

import { createStore, applyMiddleware, compose } from "redux";
import { createStateSyncMiddleware } from "redux-state-sync";
import { persistStore } from "redux-persist";

import createRootReducer from "./store/reducers/rootReducer";
import actionTypes from "./store/actions/actionTypes";

const environment = process.env.NODE_ENV || "development";
let isDevelopment = environment === "development";

//hide redux logs
isDevelopment = false;

export const history = createBrowserHistory({
    basename: process.env.REACT_APP_ROUTER_BASE_NAME,
});

const reduxStateSyncConfig = {
    whitelist: [actionTypes.APP_START_UP_COMPLETE],
};

// tao root reducer
const rootReducer = createRootReducer(history);
const middleware = [
    routerMiddleware(history),
    thunkMiddleware,
    createStateSyncMiddleware(reduxStateSyncConfig),
];
if (isDevelopment) middleware.push(logger); // neu trong trang thai development thi co log

const composeEnhancers =
    isDevelopment && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        : compose;

// tạo Redux Store
const reduxStore = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(...middleware)) // sử dụng compose Enhancer để tích hợp Redux devtools
);

// dispatch là 1 hàm của Redux Store, được sử dụng để gửi các action tới Redux Store
export const dispatch = reduxStore.dispatch;

// persistor co chuc nang luu tru, khoi phuc State của Redux Store
export const persistor = persistStore(reduxStore);

export default reduxStore;
