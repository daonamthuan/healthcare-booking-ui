import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./DoctorSchedule.scss";
import moment from "moment";
import localization from "moment/locale/vi";
import { LANGUAGES } from "../../../utils";
import { getScheduleDoctorByDate } from "../../../services/userService";
import { FormattedMessage } from "react-intl";
import BookingModal from "./Modal/BookingModal";

class DoctorSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDays: [],
            allAvailableTime: [],
            isOpenModalBooking: false,
            dataScheduleTimeModal: {},
        };
    }

    async componentDidMount() {
        let { language } = this.props;
        let allDays = this.getArrDays(language);

        this.setState({
            allDays: allDays,
        });
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
            let allDays = this.getArrDays(this.props.language);
            this.setState({
                allDays: allDays,
            });
        }

        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let allDays = this.getArrDays(this.props.language);
            let res = await getScheduleDoctorByDate(
                this.props.doctorIdFromParent,
                allDays[0].value
            );

            this.setState({
                allAvailableTime: res.data ? res.data : [],
            });
        }
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    getArrDays = (language) => {
        let allDays = [];
        for (let i = 0; i < 7; i++) {
            let obj = {};

            if (language === LANGUAGES.VI) {
                if (i === 0) {
                    // ngay hom nay
                    let today = moment(new Date()).format("DD/MM");
                    today = "Hôm nay - " + today;
                    obj.label = today;
                } else {
                    let labelVi = moment(new Date()).add(i, "days").format("dddd - DD/MM");
                    obj.label = this.capitalizeFirstLetter(labelVi);
                }
            } else {
                if (i === 0) {
                    // today
                    let today = moment(new Date()).format("DD/MM");
                    today = "Today - " + today;
                    obj.label = today;
                } else {
                    obj.label = moment(new Date())
                        .add(i, "days")
                        .locale("en")
                        .format("ddd - DD/MM");
                }
            }
            obj.value = moment(new Date())
                .add(i, "days")
                .startOf("day") // lay thoi diem 00:00:00 cua ngay
                .valueOf();

            allDays.push(obj);
        }

        return allDays;
    };

    handleOnChangeSelect = async (event) => {
        if (this.props.doctorIdFromParent !== -1) {
            let doctorId = this.props.doctorIdFromParent;
            let date = event.target.value;
            let res = await getScheduleDoctorByDate(doctorId, date);
            console.log("Check get schedule by date: ", res);

            let allTime = [];
            if (res && res.errCode === 0) {
                allTime = res.data;
            }
            this.setState({
                allAvailableTime: res.data ? res.data : [],
            });
            console.log("Check response schedule by date react: ", res);
        }
    };

    handleClickScheduleTime = (time) => {
        this.setState({
            isOpenModalBooking: true,
            dataScheduleTimeModal: time,
        });
        console.log("handleClickScheduleTime: ", time);
    };

    closeBookingModal = () => {
        this.setState({
            isOpenModalBooking: false,
        });
    };

    render() {
        let { allDays, allAvailableTime, isOpenModalBooking, dataScheduleTimeModal } = this.state;
        let { language } = this.props;
        return (
            <>
                <div className="doctor-schedule-container">
                    <div className="all-schedule">
                        <select
                            onChange={(event) => {
                                this.handleOnChangeSelect(event);
                            }}
                        >
                            {allDays &&
                                allDays.length > 0 &&
                                allDays.map((item, index) => {
                                    return (
                                        <option key={index} value={item.value}>
                                            {item.label}
                                        </option>
                                    );
                                })}
                        </select>
                    </div>
                    <div className="all-available-time">
                        <div className="text-calendar">
                            <i className="fas fa-calendar-alt">
                                <span>
                                    <FormattedMessage id="patient.detail-doctor.schedule" />
                                </span>
                            </i>
                        </div>
                        <div className="time-content">
                            {allAvailableTime && allAvailableTime.length > 0 ? (
                                <>
                                    <div className="time-content-button">
                                        {allAvailableTime.map((item, index) => {
                                            let timeDisplay =
                                                language === LANGUAGES.VI
                                                    ? item.timeTypeData.valueVi
                                                    : item.timeTypeData.valueEn;
                                            let classNameButton =
                                                language === LANGUAGES.VI
                                                    ? "button-vi"
                                                    : "button-en";
                                            return (
                                                <button
                                                    className={classNameButton}
                                                    key={index}
                                                    onClick={() =>
                                                        this.handleClickScheduleTime(item)
                                                    }
                                                >
                                                    {timeDisplay}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="book-free">
                                        <span>
                                            <FormattedMessage id="patient.detail-doctor.choose" />
                                            <i className="far fa-hand-point-up"></i>
                                            <FormattedMessage id="patient.detail-doctor.book-free" />
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="no-schedule">
                                    <FormattedMessage id="patient.detail-doctor.no-schedule" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <BookingModal
                    isOpenModal={isOpenModalBooking}
                    closeBookingClose={this.closeBookingModal}
                    dataTime={dataScheduleTimeModal}
                />
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
