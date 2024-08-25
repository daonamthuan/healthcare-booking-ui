import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./RemedyModal.scss";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import * as actions from "../../../store/actions";
import { toast } from "react-toastify";
import moment from "moment";
import { CommonUtils } from "../../../utils";

class RemedyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            imageBase64: "",
        };
    }

    async componentDidMount() {
        if (this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email,
            });
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
        }

        if (this.props.dataModal !== prevProps.dataModal) {
            this.setState({
                email: this.props.dataModal.email,
            });
        }
    }

    handleOnChangeEmail = (event) => {
        this.setState({
            email: event.target.value,
        });
    };

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file); // encode image
            this.setState({
                imageBase64: base64,
            });
        }
    };

    handleSendRemedy = () => {
        this.props.sendRemedy(this.state);
    };

    render() {
        let { isOpenModal, closeRemedyModal, dataModal } = this.props;

        return (
            <Modal
                isOpen={isOpenModal}
                className="remedy-modal-container"
                size="sm"
                backdrop={true}
            >
                <div className="modal-header">
                    <h5 className="modal-title">Gửi hóa đơn khám bệnh</h5>
                    <button
                        type="button"
                        className="close"
                        aria-label="Close"
                        onClick={closeRemedyModal}
                    >
                        <span aria-hidden={true}>x</span>
                    </button>
                </div>
                <ModalBody>
                    <div className="row">
                        <div className="col-6 form-group">
                            <label>Email bệnh nhân</label>
                            <input
                                className="form-control"
                                type="email"
                                value={this.state.email}
                                onChange={(event) => this.handleOnChangeEmail(event)}
                            />
                        </div>
                        <div className="col-6 form-group">
                            <label>Chọn File đơn thuốc</label>
                            <input
                                className="form-control-file"
                                type="file"
                                onChange={(event) => this.handleOnChangeImage(event)}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button className="btn-remedy-cancel" onClick={closeRemedyModal}>
                        <FormattedMessage id="patient.booking-modal.cancel" />
                    </Button>
                    <Button className="btn-remedy-confirm" onClick={() => this.handleSendRemedy()}>
                        <FormattedMessage id="patient.booking-modal.confirm" />
                    </Button>
                </ModalFooter>
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

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
