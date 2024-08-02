import actionTypes from "./actionTypes";
import {
    getAllCodeService,
    createNewUserService,
    getAllUsers,
    deleteUserService,
    editUserService,
    getTopDoctorHomeService,
    getAllDoctors,
    saveDetailDoctor,
} from "../../services/userService";
import { toast } from "react-toastify";

// export const fetchGenderStart = () => ({
//     type: actionTypes.FETCH_GENDER_START,
// });

export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_GENDER_START }); // de fire 1 actions bat dung phai dung tu khoa dispatch de gui qua Reducer xu ly
            let res = await getAllCodeService("GENDER");
            if (res && res.errCode == 0) {
                dispatch(fetchGenderSuccess(res.data)); // de fire 1 actions bat dung phai dung tu khoa dispatch
            } else {
                dispatch(fetchGenderFailed());
            }
        } catch (err) {
            dispatch(fetchGenderFailed());
            console.log("fetch gender failed error: ", err);
        }
    };
};

export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData,
});

export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED,
});

export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("POSITION");
            if (res && res.errCode == 0) {
                dispatch(fetchPositionSuccess(res.data)); // de fire 1 actions bat dung phai dung tu khoa dispatch
            } else {
                dispatch(fetchPositionFailed());
            }
        } catch (err) {
            dispatch(fetchPositionFailed());
            console.log("fetch Position failed error: ", err);
        }
    };
};

export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData,
});

export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED,
});

export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("ROLE");
            if (res && res.errCode == 0) {
                dispatch(fetchRoleSuccess(res.data)); // de fire 1 actions bat dung phai dung tu khoa dispatch
            } else {
                dispatch(fetchRoleFailed());
            }
        } catch (err) {
            dispatch(fetchRoleFailed());
            console.log("fetch Position failed error: ", err);
        }
    };
};

export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData,
});

export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED,
});

export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            console.log("Check data before save: ", data);
            let res = await createNewUserService(data);
            if (res && res.errCode == 0) {
                toast.success("Create a new user successfully!");
                dispatch(saveUserSuccess()); // de fire 1 actions bat dung phai dung tu khoa dispatch
                dispatch(fetchAllUsersStart());
            } else {
                dispatch(saveUserFailed());
            }
        } catch (err) {
            dispatch(saveUserFailed());
            console.log("save user failed error: ", err);
        }
    };
};

export const saveUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS,
});

export const saveUserFailed = () => ({
    type: actionTypes.CREATE_USER_FAILED,
});

export const fetchAllUsersStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllUsers("ALL");
            if (res && res.errCode == 0) {
                dispatch(fetchAllUsersSuccess(res.users.reverse())); // de fire 1 actions bat dung phai dung tu khoa dispatch
            } else {
                toast.error("Error when fetching all users");
                dispatch(fetchAllUsersFailed());
            }
        } catch (err) {
            toast.error("Error when fetching all users");
            dispatch(fetchAllUsersFailed());
            console.log("fetch Position failed error: ", err);
        }
    };
};

export const fetchAllUsersSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USERS_SUCCESS,
    users: data,
});

export const fetchAllUsersFailed = () => ({
    type: actionTypes.FETCH_ALL_USERS_FAILED,
});

export const deleteAUser = (userId) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteUserService(userId);
            if (res && res.errCode == 0) {
                toast.success("Delete user successfully!");
                dispatch(deleteUserSuccess()); // de fire 1 actions bat dung phai dung tu khoa dispatch
                dispatch(fetchAllUsersStart());
            } else {
                toast.error("Error when deleting user !");
                dispatch(deleteUserFailed());
            }
        } catch (err) {
            toast.error("Error when deleting user !");
            dispatch(deleteUserFailed());
            console.log("Delete user failed error: ", err);
        }
    };
};

export const deleteUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS,
});

export const deleteUserFailed = () => ({
    type: actionTypes.DELETE_USER_FAILED,
});

export const editAUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await editUserService(data);
            if (res && res.errCode == 0) {
                toast.success("Update user successfully!");
                dispatch(editUserSuccess()); // de fire 1 actions bat dung phai dung tu khoa dispatch
                dispatch(fetchAllUsersStart());
            } else {
                toast.error("Error when editing user !");
                dispatch(editUserFailed());
            }
        } catch (err) {
            toast.error("Error when editing user !");
            dispatch(editUserFailed());
            console.log("Edit user failed error: ", err);
        }
    };
};

export const editUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS,
});

export const editUserFailed = () => ({
    type: actionTypes.EDIT_USER_FAILED,
});

// let res1 = await getTopDoctorHomeService(3);
// console.log("Check response get top 3 doctor: ", res1);

export const fetchTopDoctor = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getTopDoctorHomeService(10);
            if (res && res.errCode === 0) {
                dispatch(fetchTopDoctorSuccess(res.data));
                console.log("Check after fire actions: ", res);
            } else {
                dispatch(fetchTopDoctorFailed());
            }
        } catch (err) {
            console.log("Fetch top doctor failed: ", err);
            dispatch(fetchTopDoctorFailed());
        }
    };
};

export const fetchTopDoctorSuccess = (data) => ({
    type: actionTypes.FETCH_TOP_DOCTORS_SUCCESS,
    dataDoctors: data,
});

export const fetchTopDoctorFailed = () => ({
    type: actionTypes.FETCH_TOP_DOCTORS_FAILED,
});

export const fetchAllDoctors = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllDoctors();
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_SUCCESS,
                    dataDr: res.data,
                });
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_FAILED,
                });
            }
        } catch (err) {
            console.log("Fetch all doctor failed: ", err);
            dispatch({
                type: actionTypes.FETCH_ALL_DOCTORS_FAILED,
            });
        }
    };
};

export const saveDetailInforDoctor = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await saveDetailDoctor(data);
            if (res && res.errCode === 0) {
                toast.success("Save doctor infor successfully !");
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS,
                });
            } else {
                toast.error("Error when saving doctor infor!");
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED,
                });
            }
        } catch (err) {
            toast.error("Error when saving doctor infor!");
            console.log("Fetch all doctor failed: ", err);
            dispatch({
                type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED,
            });
        }
    };
};
