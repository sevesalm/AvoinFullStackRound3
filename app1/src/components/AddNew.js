import React from "react";

class AddNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = { askForConfirm: false };
  }

  handleClick = event => {
    event.preventDefault();
    if (this.props.inputExists) {
      this.setState({ askForConfirm: !this.state.askForConfirm }, () => {
        if (!this.state.askForConfirm) {
          this.props.addRecord();
        } else {
          setTimeout(() => this.setState({ askForConfirm: false }), 2000);
        }
      });
    } else {
      this.props.addRecord();
      this.setState({ askForConfirm: false });
    }
  };

  render() {
    return (
      <div>
        <h3>Lisää uusi</h3>
        <form>
          <div>
            nimi:{" "}
            <input
              value={this.props.newName}
              onChange={this.props.handleNameChange}
            />
          </div>
          <div>
            numero:{" "}
            <input
              value={this.props.newNumber}
              onChange={this.props.handleNumberChange}
            />
          </div>
          <div>
            <button onClick={this.handleClick}>
              {this.state.askForConfirm ? "Confirm?" : "lisää"}
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default AddNew;
