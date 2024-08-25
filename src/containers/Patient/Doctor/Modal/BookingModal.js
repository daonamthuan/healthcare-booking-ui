import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./BookingModal.scss";
import { Modal } from "reactstrap";
import ProfileDoctor from "../ProfileDoctor";
import _, { first } from "lodash";
import DatePicker from "../../../../components/Input/DatePicker";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import Select from "react-select";
import { postPatientBookAppointment } from "../../../../services/userService";
import { toast } from "react-toastify";
import moment from "moment";

class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: "",
            phoneNumber: "",
            email: "",
            address: "",
            reason: "",
            birthday: "",
            doctorId: "",
            genders: "",
            selectedGender: "",
            timeType: "",
        };
    }

    async componentDidMount() {
        this.props.getGenders();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
            this.setState({
                genders: this.buildDataGender(this.props.genders),
            });
        }
        if (this.props.genders !== prevProps.genders) {
            if (this.props.genders.length > 0) {
                this.setState({
                    genders: this.buildDataGender(this.props.genders),
                });
            }
        }

        if (this.props.dataTime !== prevProps.dataTime) {
            if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
                this.setState({
                    doctorId: this.props.dataTime.doctorId,
                    timeType: this.props.dataTime.timeType,
                });
            }
        }
    }

    buildDataGender = (data) => {
        let result = [];
        let language = this.props.language;
        if (data && data.length > 0) {
            data.map((item, index) => {
                let obj = {};
                obj.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                obj.value = item.keyMap;
                result.push(obj);
            });
        }

        return result;
    };

    handleOnchangeInput = (event, id) => {
        let valueInput = event.target.value;
        let copyState = { ...this.state };
        copyState[id] = valueInput;
        this.setState({
            ...copyState,
        });
    };

    handleOnChangeDatePicker = (date) => {
        if (date) {
            this.setState({
                birthday: date[0],
            });
        }
    };

    handleChangeSelect = (selectedOption) => {
        this.setState({
            selectedGender: selectedOption,
        });
    };

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    buildTimeBooking = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let time =
                language === LANGUAGES.VI
                    ? dataTime.timeTypeData.valueVi
                    : dataTime.timeTypeData.valueEn;
            let date =
                language === LANGUAGES.VI
                    ? this.capitalizeFirstLetter(
                          moment(new Date(+dataTime.date)).format("dddd - DD/MM/YYYY")
                      )
                    : moment(new Date(+dataTime.date)).locale("en").format("ddd - MM/DD/YYYY");
            return `${time} - ${date}`;
        }

        return "";
    };

    buildDoctorName = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let name =
                language === LANGUAGES.VI
                    ? `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`
                    : `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`;
            return name;
        }

        return "";
    };

    handleConfirmBooking = async () => {
        console.log("handle confirm booking: ", this.state);
        // convert to Timestamp Unix String
        // let date = new Date(this.state.birthday).getTime();
        let timeString = this.buildTimeBooking(this.props.dataTime);
        let doctorName = this.buildDoctorName(this.props.dataTime);

        let res = await postPatientBookAppointment({
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            date: this.props.dataTime.date,
            doctorId: this.state.doctorId,
            selectedGender: this.state.selectedGender.value,
            timeType: this.state.timeType,
            language: this.props.language,
            timeString: timeString,
            doctorName: doctorName,
        });

        if (res && res.errCode === 0) {
            toast.success("Booking a new appointment successfully!");
        } else {
            toast.error("Booking a new appointment fail");
        }
        console.log("handle confirm booking: ", this.state);
    };

    render() {
        let { isOpenModal, closeBookingClose, dataTime } = this.props;
        let doctorId = dataTime && !_.isEmpty(dataTime) ? dataTime.doctorId : "";
        console.log("Check props booking modal: ", this.props);
        return (
            <Modal isOpen={isOpenModal} className="booking-modal-container" backdrop={true}>
                <div className="booking-modal-content">
                    <div className="booking-modal-header">
                        <span className="left">
                            <FormattedMessage id="patient.booking-modal.title" />
                        </span>
                        <span className="right" onClick={closeBookingClose}>
                            <i className="fas fa-times"></i>
                        </span>
                    </div>
                    <div className="booking-modal-body">
                        <div className="doctor-infor">
                            <ProfileDoctor
                                doctorId={doctorId}
                                isShowDescriptionDoctor={false}
                                dataTime={dataTime}
                                isShowPrice={true}
                                isShowLinkDetail={false}
                            />
                        </div>
                        <div className="row">
                            <div className="col-6 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.fullName" />
                                </label>
                                <input
                                    className="form-control"
                                    value={this.state.fullName}
                                    onChange={(event) =>
                                        this.handleOnchangeInput(event, "fullName")
                                    }
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.phoneNumber" />
                                </label>
                                <input
                                    className="form-control"
                                    value={this.state.phoneNumber}
                                    onChange={(event) =>
                                        this.handleOnchangeInput(event, "phoneNumber")
                                    }
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.email" />
                                </label>
                                <input
                                    className="form-control"
                                    value={this.state.email}
                                    onChange={(event) => this.handleOnchangeInput(event, "email")}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.address" />
                                </label>
                                <input
                                    className="form-control"
                                    value={this.state.address}
                                    onChange={(event) => this.handleOnchangeInput(event, "address")}
                                />
                            </div>
                            <div className="col-12 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.reason" />
                                </label>
                                <input
                                    className="form-control"
                                    value={this.state.reason}
                                    onChange={(event) => this.handleOnchangeInput(event, "reason")}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.birthday" />
                                </label>
                                <DatePicker
                                    onChange={(date) => {
                                        this.handleOnChangeDatePicker(date);
                                    }}
                                    className="form-control"
                                    value={this.state.birthday}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.gender" />
                                </label>
                                <Select
                                    value={this.state.selectedGender}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.genders}
                                    placeholder={
                                        <FormattedMessage id="admin.manage-doctor.chooseDoctor" />
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <div className="booking-modal-footer">
                        <button className="btn-booking-cancel" onClick={closeBookingClose}>
                            <FormattedMessage id="patient.booking-modal.cancel" />
                        </button>
                        <button
                            className="btn-booking-confirm"
                            onClick={() => this.handleConfirmBooking()}
                        >
                            <FormattedMessage id="patient.booking-modal.confirm" />
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getGenders: () => dispatch(actions.fetchGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
