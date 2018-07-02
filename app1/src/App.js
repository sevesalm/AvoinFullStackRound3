import React from "react";
import persist from "./services/persist";
import Details from "./components/Details";
import Filter from "./components/Filter";
import AddNew from "./components/AddNew";
import Notification from "./components/Notification";

const NOTIFICATION_DELAY = 2000;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      persons: [],
      newName: "",
      newNumber: "",
      filter: "",
      notification: null
    };
  }

  componentDidMount() {
    persist.getAll().then(data => this.setState({ persons: data }));
  }

  handleFilterChange = event => this.setState({ filter: event.target.value });

  handleNameChange = event => this.setState({ newName: event.target.value });

  handleNumberChange = event =>
    this.setState({ newNumber: event.target.value });

  addRecord = () => {
    const newRecord = {
      name: this.state.newName,
      number: this.state.newNumber
    };

    const found = this.state.persons.find(item => item.name === newRecord.name);

    if (!found) {
      persist.create(newRecord).then(data => {
        this.setState({
          persons: this.state.persons.concat(data),
          newName: "",
          newNumber: "",
          notification: {
            message: `Added a new record for ${data.name}`,
            type: 0
          }
        });
        setTimeout(
          () => this.setState({ notification: null }),
          NOTIFICATION_DELAY
        );
      });
    } else {
      persist
        .update(found.id, newRecord)
        .then(data => {
          this.setState({
            persons: this.state.persons.map(
              item => (item.id === found.id ? data : item)
            ),
            newName: "",
            newNumber: "",
            notification: {
              message: `Updated a record of ${data.name}`,
              type: 0
            }
          });
          setTimeout(
            () => this.setState({ notification: null }),
            NOTIFICATION_DELAY
          );
        })
        .catch(err => {
          this.setState({
            persons: this.state.persons.filter(item => item.id !== found.id),
            newName: "",
            newNumber: "",
            notification: {
              message: `Failed to update a record of ${found.name}`,
              type: 1
            }
          });
          setTimeout(
            () => this.setState({ notification: null }),
            NOTIFICATION_DELAY
          );
        });
    }
    return this.setState({ newName: "", newNumber: "" });
  };

  handleDelete = id => {
    persist.delete(id).then(data => {
      console.log(data);

      this.setState({
        persons: this.state.persons.filter(item => item.id !== id),
        notification: { message: `Deleted a record of id ${id}`, type: 0 }
      });
      setTimeout(
        () => this.setState({ notification: null }),
        NOTIFICATION_DELAY
      );
    });
  };

  render() {
    return (
      <div>
        <h2>Puhelinluettelo</h2>
        <Notification data={this.state.notification} />
        <Filter onChange={this.handleFilterChange} />
        <AddNew
          addRecord={this.addRecord}
          newName={this.state.newName}
          newNumber={this.state.newNumber}
          handleNameChange={this.handleNameChange}
          handleNumberChange={this.handleNumberChange}
          inputExists={
            this.state.persons.filter(item => item.name === this.state.newName)
              .length
          }
        />
        <h2>Numerot</h2>
        <table>
          <tbody>
            {this.state.persons
              .filter(
                item =>
                  item.name
                    .toLocaleLowerCase()
                    .indexOf(this.state.filter.toLocaleLowerCase()) !== -1
              )
              .map(item => (
                <Details
                  key={item.id}
                  details={item}
                  handleDelete={this.handleDelete}
                />
              ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
