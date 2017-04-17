import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';

class Confirm extends React.Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    onHide: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    labelOk: PropTypes.string,
    labelCancel: PropTypes.string,
  };

  static defaultProps = {
    labelOk: 'Ok',
    labelCancel: 'Cancel',
  };

  constructor(props) {
    super(props);

    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleCancel() {
    this.props.onHide();
  }

  handleSubmit() {
    this.props.onSubmit();
  }

  render() {
    const { show, message, labelOk, labelCancel, onHide } = this.props;

    return (
      <Modal
        show={show}
        onHide={onHide}
        bsSize="small"
      >
        <Modal.Body>
          <p>{message}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleSubmit} bsStyle="danger">{labelOk}</Button>
          <Button onClick={this.handleCancel}>{labelCancel}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default Confirm;
