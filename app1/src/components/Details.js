import React from "react";

class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = { askForConfirm: false };
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  handleClick = () => {
    if (this.state.askForConfirm) {
      this.props.handleDelete(this.props.details.id);
    } else {
      this.setState({ askForConfirm: !this.state.askForConfirm });
      this.timer = setTimeout(
        () => this.setState({ askForConfirm: false }),
        2000
      );
    }
  };

  render() {
    return (
      <tr>
        <td>{this.props.details.name}</td>
        <td>{this.props.details.number}</td>
        <td>
          <button onClick={this.handleClick}>
            {this.state.askForConfirm ? "Confirm?" : "Delete"}
          </button>
        </td>
      </tr>
    );
  }
}

export default Details;
