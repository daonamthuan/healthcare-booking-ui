import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import "./ManageDoctor.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
// import style manually
import "react-markdown-editor-lite/lib/index.css";
import Select from "react-select";
import { CRUD_ACTIONS, LANGUAGES } from "../../../utils";
import { getDetailInforDoctor } from "../../../services/userService";
import { has } from "lodash";

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // save to "Markdown" model
            contentMarkdown: "",
            contentHTML: "",
            selectedDoctor: "",
            description: "",
            listDoctors: [],
            hasOldData: false,

            // save to "Doctor_Info" model
            listPrice: [],
            selectedPrice: "",
            listPayment: [],
            selectedPayment: "",
            listProvince: [],
            selectedProvince: "",
            nameClinic: "",
            addressClinic: "",
            note: "",

            listClinic: [],
            selectedClinic: "",
            listSpecialty: [],
            selectedSpecialty: "",
            clinicId: "",
            specialtyId: "",
        };
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.getAllRequiredDoctorInfor();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // neu co su thay doi props
        if (prevProps.allDoctors != this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, "USERS");
            this.setState({
                listDoctors: dataSelect,
            });
        }

        if (this.props.allRequiredDoctorInfor !== prevProps.allRequiredDoctorInfor) {
            let { resPrice, resPayment, resProvince, resSpecialty, resClinic } =
                this.props.allRequiredDoctorInfor;
            let dataSelectPrice = this.buildDataInputSelect(resPrice, "PRICE");
            let dataSelectPayment = this.buildDataInputSelect(resPayment, "PAYMENT");
            let dataSelectProvince = this.buildDataInputSelect(resProvince, "PROVINCE");
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, "SPECIALTY");
            let dataSelectClinic = this.buildDataInputSelect(resClinic, "CLINIC");
            console.log("Check all required doctor info: ", this.props.allRequiredDoctorInfor);
            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listSpecialty: dataSelectSpecialty,
                listClinic: dataSelectClinic,
            });
        }

        if (prevProps.language != this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, "USERS");
            let { resPrice, resPayment, resProvince } = this.props.allRequiredDoctorInfor;
            let dataSelectPrice = this.buildDataInputSelect(resPrice, "PRICE");
            let dataSelectPayment = this.buildDataInputSelect(resPayment, "PAYMENT");
            let dataSelectProvince = this.buildDataInputSelect(resProvince, "PROVINCE");

            this.setState({
                listDoctors: dataSelect,
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
            });
        }
    }

    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            if (type === "USERS") {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.firstName} ${item.lastName}`;
                    let labelEn = `${item.lastName} ${item.firstName}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id;
                    result.push(object);
                });
            } else if (type === "PRICE") {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi} đ`;
                    let labelEn = `${item.valueEn} USD`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object);
                });
            } else if (type === "PAYMENT" || type === "PROVINCE") {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object);
                });
            } else if (type === "SPECIALTY" || type === "CLINIC") {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.name;
                    object.value = item.id;
                    result.push(object);
                });
            }
        }

        return result;
    };

    // Finish!
    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html,
        });
    };

    handleChangeSelect = async (selectedDoctor) => {
        this.setState({ selectedDoctor });
        let { listPrice, listPayment, listProvince, listSpecialty, listClinic } = this.state;

        let res = await getDetailInforDoctor(selectedDoctor.value);
        if (res && res.errCode === 0 && res.data && res.data.Markdown) {
            let markdown = res.data.Markdown;
            let addressClinic = "",
                nameClinic = "",
                note = "",
                paymentId = "",
                priceId = "",
                provinceId = "",
                specialtyId = "",
                clinicId = "",
                //
                findPrice = "",
                findPayment = "",
                findProvince = "",
                findSpecialty = "",
                findClinic = "";

            if (res.data.Doctor_Infor) {
                addressClinic = res.data.Doctor_Infor.addressClinic;
                nameClinic = res.data.Doctor_Infor.nameClinic;
                note = res.data.Doctor_Infor.note;
                paymentId = res.data.Doctor_Infor.paymentId;
                priceId = res.data.Doctor_Infor.priceId;
                provinceId = res.data.Doctor_Infor.provinceId;
                specialtyId = res.data.Doctor_Infor.specialtyId;
                clinicId = res.data.Doctor_Infor.clinicId;

                findPrice = listPrice.find((item) => item.value === priceId);
                findPayment = listPayment.find((item) => item.value === paymentId);
                findProvince = listProvince.find((item) => item.value === provinceId);
                findSpecialty = listSpecialty.find((specialty) => specialty.value === specialtyId);
                findClinic = listClinic.find((clinic) => clinic.value === clinicId);
                console.log(
                    "Check found item: ",
                    findPrice,
                    findPayment,
                    findProvince,
                    findSpecialty,
                    findClinic
                );
            }

            this.setState({
                contentMarkdown: markdown.contentMarkdown,
                contentHTML: markdown.contentHTML,
                description: markdown.description,
                hasOldData: true,
                addressClinic: addressClinic,
                nameClinic: nameClinic,
                note: note,
                selectedPrice: findPrice,
                selectedPayment: findPayment,
                selectedProvince: findProvince,
                selectedSpecialty: findSpecialty,
                selectedClinic: findClinic,
            });
        } else {
            this.setState({
                contentMarkdown: "",
                contentHTML: "",
                description: "",
                hasOldData: false,
                addressClinic: "",
                nameClinic: "",
                note: "",
                selectedPrice: "",
                selectedPayment: "",
                selectedProvince: "",
                selectedSpecialty: "",
                selectedClinic: "",
            });
        }
    };

    handleChangeSelectDoctorInfor = async (selectedOption, name) => {
        let stateName = name.name; // lay ten React-Select
        let stateCopy = { ...this.state };
        stateCopy[stateName] = selectedOption;

        this.setState({
            ...stateCopy,
        });
        console.log("Check handleChangeSelectDoctorInfor param: ", selectedOption, name);
    };

    handleOnChangeText = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
        });
    };

    handleSaveContentMarkdown = () => {
        let { hasOldData } = this.state;

        this.props.saveDetailDoctor({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedDoctor.value,
            action: hasOldData ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

            selectedPrice: this.state.selectedPrice.value,
            selectedPayment: this.state.selectedPayment.value,
            selectedProvince: this.state.selectedProvince.value,
            nameClinic: this.state.nameClinic,
            addressClinic: this.state.addressClinic,

            note: this.state.note,
            clinicId:
                this.state.selectedClinic && this.state.selectedClinic.value
                    ? this.state.selectedClinic.value
                    : "",
            specialtyId: this.state.selectedSpecialty.value,
        });
    };

    render() {
        console.log("Check state manage doctor: ", this.state);
        let { hasOldData } = this.state;
        return (
            <div className="manage-doctor-container">
                <div className="manage-doctor-title">
                    <FormattedMessage id="admin.manage-doctor.title" />
                </div>
                <div className="more-info">
                    <div className="content-left form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.select-doctor" />
                        </label>
                        <Select
                            value={this.state.selectedDoctor}
                            onChange={this.handleChangeSelect}
                            options={this.state.listDoctors}
                            placeholder={<FormattedMessage id="admin.manage-doctor.chooseDoctor" />}
                        />
                    </div>
                    <div className="content-right">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.intro" />
                        </label>
                        <textarea
                            className="form-control"
                            onChange={(event) => {
                                this.handleOnChangeText(event, "description");
                            }}
                            value={this.state.description}
                        >
                            Gia dinh khoe manh, binh an, hanh phuc.
                        </textarea>
                    </div>
                </div>

                <div className="more-info-extra row">
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.price" />
                        </label>
                        <Select
                            value={this.state.selectedPrice}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listPrice}
                            placeholder={<FormattedMessage id="admin.manage-doctor.choosePrice" />}
                            name="selectedPrice"
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.payment" />
                        </label>
                        <Select
                            value={this.state.selectedPayment}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listPayment}
                            placeholder={
                                <FormattedMessage id="admin.manage-doctor.choosePayment" />
                            }
                            name="selectedPayment"
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.province" />
                        </label>
                        <Select
                            value={this.state.selectedProvince}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listProvince}
                            placeholder={
                                <FormattedMessage id="admin.manage-doctor.chooseProvince" />
                            }
                            name="selectedProvince"
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.nameClinic" />
                        </label>
                        <input
                            className="form-control"
                            onChange={(event) => {
                                this.handleOnChangeText(event, "nameClinic");
                            }}
                            value={this.state.nameClinic}
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.addressClinic" />
                        </label>
                        <input
                            className="form-control"
                            onChange={(event) => {
                                this.handleOnChangeText(event, "addressClinic");
                            }}
                            value={this.state.addressClinic}
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.note" />
                        </label>
                        <input
                            className="form-control"
                            onChange={(event) => {
                                this.handleOnChangeText(event, "note");
                            }}
                            value={this.state.note}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.specialty" />
                        </label>
                        <Select
                            value={this.state.selectedSpecialty}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listSpecialty}
                            placeholder={
                                <FormattedMessage id="admin.manage-doctor.chooseSpecialty" />
                            }
                            name="selectedSpecialty"
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.clinic" />
                        </label>
                        <Select
                            value={this.state.selectedClinic}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listClinic}
                            placeholder={<FormattedMessage id="admin.manage-doctor.chooseClinic" />}
                            name="selectedClinic"
                        />
                    </div>
                </div>
                <div className="manage-doctor-editor">
                    <MdEditor
                        style={{ height: "300px" }}
                        renderHTML={(text) => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                    />
                </div>

                <button
                    className={hasOldData ? "save-content-doctor" : "create-content-doctor"}
                    onClick={() => {
                        this.handleSaveContentMarkdown();
                    }}
                >
                    {hasOldData ? (
                        <span>
                            <FormattedMessage id="admin.manage-doctor.save" />
                        </span>
                    ) : (
                        <span>
                            <FormattedMessage id="admin.manage-doctor.add" />
                        </span>
                    )}
                </button>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        allDoctors: state.admin.allDoctors,
        language: state.app.language,
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        getAllRequiredDoctorInfor: () => dispatch(actions.getRequiredDoctorInfor()),
        saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
