import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { FormattedDate, FormattedMessage } from "react-intl";
import "./ManagePatient.scss";
import DatePicker from "../../../components/Input/DatePicker";
import { getAllPatientForDoctor, postSendRemedy } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import RemedyModal from "./RemedyModal";
import { toast } from "react-toastify";
import moment from "moment";
import LoadingOverlay from "react-loading-overlay";

class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf("day").valueOf(),
            dataPatient: [],
            isOpenRemedyModal: false,
            dataModal: {},
            isShowLoading: false,
        };
    }

    async componentDidMount() {
        this.getDataPatient();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
        }
    }

    getDataPatient = async () => {
        let { user } = this.props;
        let { currentDate } = this.state;
        let res = await getAllPatientForDoctor({ doctorId: user.id, date: currentDate });

        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data,
            });
        }
    };

    handleOnChangeDatePicker = (date) => {
        if (date) {
            this.setState(
                {
                    // currentDate: date[0],
                    currentDate: moment(date[0]).startOf("day").valueOf(),
                },
                async () => {
                    await this.getDataPatient();
                }
            );
        }
    };

    handleBtnConfirm = (item) => {
        let firstName = item.patientData.firstName,
            lastName = item.patientData.lastName;
        let data = {
            email: item.patientData.email,
            doctorId: item.doctorId,
            patientId: item.patientId,
            patientName:
                this.props.language === LANGUAGES.VI
                    ? `${firstName} ${lastName ? lastName : ""}`
                    : `${lastName ? lastName : ""} ${firstName}`,
            date: item.date,
            timeType: item.timeType,
            timeTypeData: {
                valueEn: item.timeTypeDataPatient.valueEn,
                valueVi: item.timeTypeDataPatient.valueVi,
            },
        };

        this.setState({
            isOpenRemedyModal: true,
            dataModal: data,
        });
    };

    closeRemedyModal = () => {
        this.setState({
            isOpenRemedyModal: false,
            dataModal: {},
        });
    };

    sendRemedy = async (dataChild) => {
        let { dataModal } = this.state;
        this.setState({
            isShowLoading: true,
        });
        let dateValueVi = this.capitalizeFirstLetter(
                moment(new Date(+dataModal.date)).format("dddd - DD/MM/YYYY")
            ),
            dateValueEn = moment(new Date(+dataModal.date)).locale("en").format("ddd - DD/MM/YYYY");

        let res = await postSendRemedy({
            email: dataChild.email,
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            patientName: dataModal.patientName,
            date: dataModal.date,
            dateData: {
                valueVi: dateValueVi,
                valueEn: dateValueEn,
            },
            timeType: dataModal.timeType,
            timeTypeData: dataModal.timeTypeData,
            imageBase64: dataChild.imageBase64,
            language: this.props.language,
        });
        this.setState({
            isShowLoading: false,
        });
        if (res && res.errCode === 0) {
            toast.success("Send receipt and remedy successfully!");
            this.closeRemedyModal();
            await this.getDataPatient();
        } else {
            toast.error("Somethings wrongs...");
        }
    };

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    render() {
        let { language } = this.props;
        let { dataPatient, isOpenRemedyModal, dataModal } = this.state;
        return (
            <>
                <LoadingOverlay active={this.state.isShowLoading} spinner text="Loading...">
                    <RemedyModal
                        isOpenModal={isOpenRemedyModal}
                        dataModal={dataModal}
                        closeRemedyModal={this.closeRemedyModal}
                        sendRemedy={this.sendRemedy}
                    />
                    <div className="manage-patient-container">
                        <div className="m-p-title">QUẢN LÝ BỆNH NHÂN KHÁM BỆNH</div>
                        <div className="manage-patient-body container">
                            <div className=" row">
                                <div className="col-4 form-group">
                                    <label>Chọn ngày khám</label>
                                    <DatePicker
                                        onChange={(date) => {
                                            this.handleOnChangeDatePicker(date);
                                        }}
                                        className="form-control"
                                        value={this.state.currentDate}
                                    />
                                </div>

                                <div className="col-12">
                                    <table
                                        className="table-manage-patient"
                                        style={{ width: "100%" }}
                                    >
                                        <tbody>
                                            <tr>
                                                <th>STT</th>
                                                <th>Thời gian</th>
                                                <th>Họ và tên</th>
                                                <th>Giới tính</th>
                                                <th>Địa chỉ</th>
                                                <th>Actions</th>
                                            </tr>
                                            {dataPatient && dataPatient.length > 0 ? (
                                                dataPatient.map((item, index) => {
                                                    let gender =
                                                        language === LANGUAGES.VI
                                                            ? item.patientData.genderData.valueVi
                                                            : item.patientData.genderData.valueEn;
                                                    let timeType =
                                                        language === LANGUAGES.VI
                                                            ? item.timeTypeDataPatient.valueVi
                                                            : item.timeTypeDataPatient.valueEn;
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{timeType}</td>
                                                            <td>
                                                                {item.patientData.firstName}{" "}
                                                                {item.patientData.lastName}
                                                            </td>
                                                            <td>{item.patientData.address}</td>
                                                            <td>{gender}</td>
                                                            <td>
                                                                <button
                                                                    className="mp-btn-confirm"
                                                                    onClick={() =>
                                                                        this.handleBtnConfirm(item)
                                                                    }
                                                                >
                                                                    Xác nhận
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan={"6"}>No data</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </LoadingOverlay>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        user: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
