import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./DoctorExtraInfor.scss";
import { getExtraInforDoctorById } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";
import NumberFormat from "react-number-format";

class DoctorExtraInfor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfor: false,
            extraInfor: {},
        };
    }

    async componentDidMount() {
        if (this.props.doctorIdFromParent) {
            let res = await getExtraInforDoctorById(this.props.doctorIdFromParent);
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfor: res.data,
                });
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
        }

        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let res = await getExtraInforDoctorById(this.props.doctorIdFromParent);
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfor: res.data,
                });
            }
            console.log("Check data extra info did update: ", res);
        }
    }

    showHideDetailInforDoctor = () => {
        this.setState({
            isShowDetailInfor: !this.state.isShowDetailInfor,
        });
    };

    render() {
        let { isShowDetailInfor, extraInfor } = this.state;
        let { language } = this.props;
        return (
            <div className="doctor-extra-infor-container">
                <div className="content-up">
                    <div className="text-address">
                        <FormattedMessage id="patient.extra-infor-doctor.text-address" />
                    </div>
                    <div className="name-clinic">
                        {extraInfor && extraInfor.nameClinic ? extraInfor.nameClinic : ""}
                    </div>

                    <div className="detail-address">
                        {extraInfor && extraInfor.addressClinic ? extraInfor.addressClinic : ""}
                    </div>
                </div>
                <div className="content-down">
                    {isShowDetailInfor ? (
                        <>
                            <div className="title-price">
                                <FormattedMessage id="patient.extra-infor-doctor.price" />
                            </div>
                            <div className="detail-infor">
                                <div className="price">
                                    <span className="left">
                                        <FormattedMessage id="patient.extra-infor-doctor.price" />
                                    </span>
                                    <span className="right">
                                        {extraInfor &&
                                            extraInfor.priceTypeData &&
                                            language === LANGUAGES.VI && (
                                                <NumberFormat
                                                    className="currency"
                                                    value={extraInfor.priceTypeData.valueVi}
                                                    display={"text"}
                                                    thousandSeparator={true}
                                                    suffix={"VND"}
                                                />
                                            )}
                                        {extraInfor &&
                                            extraInfor.priceTypeData &&
                                            language === LANGUAGES.EN && (
                                                <NumberFormat
                                                    className="currency"
                                                    value={extraInfor.priceTypeData.valueEn}
                                                    display={"text"}
                                                    thousandSeparator={true}
                                                    suffix={"$"}
                                                />
                                            )}
                                    </span>
                                </div>
                                <div className="note">
                                    {extraInfor && extraInfor.note ? extraInfor.note : ""}
                                </div>
                            </div>
                            <div className="payment">
                                <FormattedMessage id="patient.extra-infor-doctor.payment" />
                                {extraInfor &&
                                language === LANGUAGES.VI &&
                                extraInfor.paymentTypeData
                                    ? extraInfor.paymentTypeData.valueVi
                                    : ""}
                                {extraInfor &&
                                language === LANGUAGES.EN &&
                                extraInfor.paymentTypeData
                                    ? extraInfor.paymentTypeData.valueEn
                                    : ""}
                            </div>

                            <div className="hide-price">
                                <span onClick={() => this.showHideDetailInforDoctor()}>
                                    <FormattedMessage id="patient.extra-infor-doctor.hide-price" />
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="short-infor">
                            <div className="title-price-short">
                                <FormattedMessage id="patient.extra-infor-doctor.price" />
                                <span className="price-short">
                                    {extraInfor &&
                                        extraInfor.priceTypeData &&
                                        language === LANGUAGES.VI && (
                                            <NumberFormat
                                                className="currency"
                                                value={extraInfor.priceTypeData.valueVi}
                                                display={"text"}
                                                thousandSeparator={true}
                                                suffix={"VND"}
                                            />
                                        )}
                                    {extraInfor &&
                                        extraInfor.priceTypeData &&
                                        language === LANGUAGES.EN && (
                                            <NumberFormat
                                                className="currency"
                                                value={extraInfor.priceTypeData.valueEn}
                                                display={"text"}
                                                thousandSeparator={true}
                                                suffix={"$"}
                                            />
                                        )}
                                </span>
                            </div>
                            <span
                                className="more-detail"
                                onClick={() => this.showHideDetailInforDoctor()}
                            >
                                <FormattedMessage id="patient.extra-infor-doctor.detail" />
                            </span>
                        </div>
                    )}
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);
