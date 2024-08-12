import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import appReducer from "./appReducer";
import userReducer from "./userReducer";
import adminReducer from "./adminReducer";

import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

const persistCommonConfig = {
    storage: storage, // local storage
    stateReconciler: autoMergeLevel2,
};

// cau hinh cho userReducer: luu tru "isLoggedIn" VÀ "userInfo" voi key la "user"
const userPersistConfig = {
    ...persistCommonConfig,
    key: "user",
    whitelist: ["isLoggedIn", "userInfo"],
};

// cau hinh cho appReducer: luu tru "language" voi key la "app"
const appPersistConfig = {
    ...persistCommonConfig,
    key: "app",
    whitelist: ["language"],
};

const adminPersistConfig = {
    ...persistCommonConfig,
    key: "admin",
    whitelist: ["users"],
};

export default (history) =>
    combineReducers({
        router: connectRouter(history),
        user: persistReducer(userPersistConfig, userReducer),
        app: persistReducer(appPersistConfig, appReducer),
        // admin: persistReducer(adminPersistConfig, adminReducer),
        admin: adminReducer,
    });
