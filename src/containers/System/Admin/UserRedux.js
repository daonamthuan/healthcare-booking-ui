import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { LANGUAGES, CRUD_ACTIONS } from "../../../utils";

import * as actions from "../../../store/actions";
import "./UserRedux.scss";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import TableManageUser from "./TableManageUser";

class UserRedux extends Component {
    // Component life cycle:
    // Constructor -> Render -> ComponentDidMount
    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImageURL: "",
            isOpen: false,

            // form
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            address: "",
            gender: "",
            position: "",
            role: "",
            avatar: "", // image URL

            action: "",
            userEditId: "",
        };
    }
    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
        // try {
        //     let res = await getAllCodeService("gender");
        //     if (res && res.errCode === 0) {
        //         this.setState({
        //             genderArr: res.data,
        //         });
        //     }
        // } catch (err) {
        //     console.log(err);
        // }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // do props truyen vao bat dong bo
        // check props truoc do va prop hien tai
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: arrGenders,
                gender:
                    arrGenders && arrGenders.length > 0
                        ? arrGenders[0].key
                        : "",
            });
        }
        if (prevProps.positionRedux !== this.props.positionRedux) {
            let arrPositions = this.props.positionRedux;
            this.setState({
                positionArr: arrPositions,
                position:
                    arrPositions && arrPositions.length > 0
                        ? arrPositions[0].key
                        : "",
            });
        }
        if (prevProps.roleRedux !== this.props.roleRedux) {
            let arrRoles = this.props.roleRedux;
            this.setState({
                roleArr: arrRoles,
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].key : "",
            });
        }

        if (prevProps.listUsers !== this.props.listUsers) {
            let arrGenders = this.props.genderRedux;
            let arrPositions = this.props.positionRedux;
            let arrRoles = this.props.roleRedux;
            this.setState({
                email: "",
                password: "",
                firstName: "",
                lastName: "",
                phoneNumber: "",
                address: "",
                gender:
                    arrGenders && arrGenders.length > 0
                        ? arrGenders[0].key
                        : "",
                position:
                    arrPositions && arrPositions.length > 0
                        ? arrPositions[0].key
                        : "",
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].key : "",
                avatar: "",
                action: CRUD_ACTIONS.CREATE,
            });
        }
    }

    handleOnChangeImage = (event) => {
        let data = event.target.files;
        let file = data[0];
        let objectURL = URL.createObjectURL(file); // quang file vao de tao 1 duong link de xem anh
        if (file) {
            this.setState({
                previewImageURL: objectURL,
                avatar: file,
            });
        }
    };

    openPreviewImage = () => {
        if (!this.state.previewImageURL) return;
        this.setState({ isOpen: true });
    };

    onChangeInput = (event, id) => {
        console.log("Event on change Input Target: ", event);
        let copyState = { ...this.state };
        this.setState({
            ...copyState,
            [id]: event.target.value,
        });
    };

    handleSaveUser = () => {
        let isValid = this.checkValidateInput();
        if (isValid) {
            let { action } = this.state;
            if (action === CRUD_ACTIONS.action) {
                // fire action to Redux
                this.props.createNewUser({
                    email: this.state.email,
                    password: this.state.password,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    phoneNumber: this.state.phoneNumber,
                    address: this.state.address,
                    gender: this.state.gender,
                    roleId: this.state.role,
                    positionId: this.state.position,
                });
            }

            if (action === CRUD_ACTIONS.EDIT) {
                // fire action edit
                this.props.editAUserRedux({
                    id: this.state.userEditId,
                    email: this.state.email,
                    password: this.state.password,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    phoneNumber: this.state.phoneNumber,
                    address: this.state.address,
                    gender: this.state.gender,
                    roleId: this.state.role,
                    positionId: this.state.position,
                    // avatar: this.state.avatar
                });
            }
        }
    };

    checkValidateInput = () => {
        let isValid = true;
        let arrCheck = [
            "email",
            "password",
            "firstName",
            "lastName",
            "phoneNumber",
            "address",
        ];
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                alert("Missing required input field: " + arrCheck[i]);
                break;
            }
        }

        return isValid;
    };

    handleEditUserFromParent = (user) => {
        console.log("Check handleEditUserFromParent: ", user);
        this.setState({
            email: user.email,
            password: "HARDCODE",
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phonenumber,
            address: user.address,
            gender: user.gender,
            position: user.positionId,
            role: user.roleId,
            avatar: user.avatar,
            action: CRUD_ACTIONS.EDIT,
            userEditId: user.id,
        });
    };

    render() {
        let genders = this.state.genderArr;
        let roles = this.state.roleArr;
        let positions = this.state.positionArr;
        let language = this.props.language;
        let isGetGenders = this.props.isLoadingGender;

        let {
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            address,
            gender,
            role,
            position,
            avatar,
        } = this.state;

        return (
            <div className="user-redux-container">
                <div className="title">User Redux voi HoidanIT User Redux</div>
                <div> {isGetGenders === true ? "Loading gender" : ""}</div>
                <div className="user-redux-body">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 my-3">
                                <FormattedMessage id="manage-user.add" />
                            </div>
                            <div className="col-3">
                                <label>
                                    <FormattedMessage id="manage-user.email" />
                                </label>
                                <input
                                    className="form-control"
                                    type="email"
                                    value={email}
                                    onChange={(event) => {
                                        this.onChangeInput(event, "email");
                                    }}
                                    disabled={
                                        this.state.action === CRUD_ACTIONS.EDIT
                                            ? true
                                            : false
                                    }
                                />
                            </div>
                            <div className="col-3">
                                <label>
                                    <FormattedMessage id="manage-user.password" />
                                </label>
                                <input
                                    className="form-control"
                                    type="password"
                                    value={password}
                                    onChange={(event) => {
                                        this.onChangeInput(event, "password");
                                    }}
                                    disabled={
                                        this.state.action === CRUD_ACTIONS.EDIT
                                            ? true
                                            : false
                                    }
                                />
                            </div>
                            <div className="col-3">
                                <label>
                                    <FormattedMessage id="manage-user.first-name" />
                                </label>
                                <input
                                    className="form-control"
                                    type="txt"
                                    value={firstName}
                                    onChange={(event) => {
                                        this.onChangeInput(event, "firstName");
                                    }}
                                />
                            </div>
                            <div className="col-3">
                                <label>
                                    <FormattedMessage id="manage-user.last-name" />
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={lastName}
                                    onChange={(event) => {
                                        this.onChangeInput(event, "lastName");
                                    }}
                                />
                            </div>
                            <div className="col-3">
                                <label>
                                    <FormattedMessage id="manage-user.phone-number" />
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(event) => {
                                        this.onChangeInput(
                                            event,
                                            "phoneNumber"
                                        );
                                    }}
                                />
                            </div>
                            <div className="col-9">
                                <label>
                                    <FormattedMessage id="manage-user.address" />
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={address}
                                    onChange={(event) => {
                                        this.onChangeInput(event, "address");
                                    }}
                                />
                            </div>
                            <div className="col-3">
                                <label>
                                    <FormattedMessage id="manage-user.gender" />
                                </label>
                                <select
                                    class="form-control"
                                    onChange={(event) => {
                                        this.onChangeInput(event, "gender");
                                    }}
                                    value={gender}
                                >
                                    {genders &&
                                        genders.length > 0 &&
                                        genders.map((item, index) => {
                                            return (
                                                <option
                                                    key={index}
                                                    value={item.key}
                                                >
                                                    {language === LANGUAGES.VI
                                                        ? item.valueVi
                                                        : item.valueEn}
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>
                            <div className="col-3">
                                <label>
                                    <FormattedMessage id="manage-user.position" />
                                </label>
                                <select
                                    class="form-control"
                                    onChange={(event) => {
                                        this.onChangeInput(event, "position");
                                    }}
                                    value={position}
                                >
                                    {positions &&
                                        positions.length > 0 &&
                                        positions.map((item, index) => {
                                            return (
                                                <option
                                                    key={index}
                                                    value={item.key}
                                                >
                                                    {language == LANGUAGES.VI
                                                        ? item.valueVi
                                                        : item.valueEn}
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>
                            <div className="col-3">
                                <label>
                                    <FormattedMessage id="manage-user.role" />
                                </label>
                                <select
                                    class="form-control"
                                    onChange={(event) => {
                                        this.onChangeInput(event, "role");
                                    }}
                                    value={role}
                                >
                                    {roles &&
                                        roles.length > 0 &&
                                        roles.map((item, index) => {
                                            return (
                                                <option
                                                    key={index}
                                                    value={item.key}
                                                >
                                                    {language == LANGUAGES.VI
                                                        ? item.valueVi
                                                        : item.valueEn}
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>
                            <div className="col-3">
                                <label>
                                    <FormattedMessage id="manage-user.image" />
                                </label>
                                <div className="preview-img-container">
                                    <input
                                        id="previewImg"
                                        type="file"
                                        hidden
                                        onChange={(event) => {
                                            this.handleOnChangeImage(event);
                                        }}
                                    />
                                    <label
                                        htmlFor="previewImg"
                                        className="label-upload"
                                    >
                                        Tải ảnh
                                        <i className="fas fa-upload"></i>
                                    </label>
                                    <div
                                        className="preview-image"
                                        style={{
                                            backgroundImage: `url(${this.state.previewImageURL})`,
                                        }}
                                        onClick={() => {
                                            this.openPreviewImage();
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div className="col-12 my-3">
                                <button
                                    className={
                                        this.state.action === CRUD_ACTIONS.EDIT
                                            ? "btn btn-warning"
                                            : "btn btn-primary"
                                    }
                                    onClick={() => {
                                        this.handleSaveUser();
                                    }}
                                >
                                    {this.state.action === CRUD_ACTIONS.EDIT ? (
                                        <FormattedMessage id="manage-user.edit" />
                                    ) : (
                                        <FormattedMessage id="manage-user.save" />
                                    )}
                                </button>
                            </div>

                            <div className="col-12 mb-5">
                                <TableManageUser
                                    handleEditUserFromParentKey={
                                        this.handleEditUserFromParent
                                    }
                                    action={this.state.action}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {this.state.isOpen && (
                    <Lightbox
                        mainSrc={this.state.previewImageURL}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                )}
            </div>
        );
    }
}

// khi component duoc dua vao DOM no se map State va Dispatch (de fire 1 action) vao props cua component
const mapStateToProps = (state) => {
    // map state tu Reducer(Redux) vao props React
    // app, admin, user: dai dien cho appReducer, adminReducer, userReducer
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        roleRedux: state.admin.roles,
        positionRedux: state.admin.positions,
        isLoadingGender: state.admin.isLoadingGender,
        listUsers: state.admin.users,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        editAUserRedux: (data) => dispatch(actions.editAUser(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
