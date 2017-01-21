import React, { Component, PropTypes } from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Button from 'react-bootstrap/lib/Button';
import { Form, Input } from '../../components/forms';

export default class BoardSearch extends Component {
  static propTypes = {
    values: PropTypes.shape({
      title: PropTypes.string,
      name: PropTypes.string,
    }).isRequired,
    onSubmit: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

  componentDidUpdate() {
    this.form.setValues(this.props.values);
  }

  handleSubmit(model) {
    this.props.onSubmit(model);
  }

  handleReset(e) {
    e.preventDefault();
    this.props.onReset();
  }

  handleCreate(e) {
    e.preventDefault();
    this.props.onCreate();
  }

  render() {
    const { title, name } = this.props.values;
    return (
      <Panel>
        <Form ref={c => (this.form = c)} onSubmit={this.handleSubmit}>
          <Row>
            <Col xs={6}>
              <Input type="text" name="title" defaultValue={title} placeholder="Title" />
            </Col>
            <Col xs={6}>
              <Input type="text" name="name" defaultValue={name} placeholder="Name" />
            </Col>
          </Row>
          <ButtonToolbar style={{ marginTop: '10px' }}>
            <ButtonGroup>
              <Button type="submit" bsStyle="primary">Search</Button>
              <Button onClick={this.handleReset}>Initialize</Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button onClick={this.handleCreate} bsStyle="info">New</Button>
            </ButtonGroup>
          </ButtonToolbar>
        </Form>
      </Panel>
    );
  }
}
