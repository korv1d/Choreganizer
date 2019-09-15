import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import withAuth from '../src/helper/auth';
import { database, auth } from '../src/firebase/index';
import { createGroup, addChore, getChores,
         addUserToGroup, getGroups, deleteGroup, deleteChore} from '../src/firebase/helper'

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '', email: '', username: '', groups: [], chores: [], isInGroup: false, currentGroup: '', currentGroupId:''
    };
  }

  componentDidMount() {
    getGroups(auth.currentUser.uid).then((value) => {
      this.setState({
        groups: value,
      });
      const { groups } = this.state;
      database.ref(`/users/${auth.currentUser.uid}`).once('value').then((snapshot) => {
        this.setState({
          name: snapshot.val().name,
          email: snapshot.val().email,
          username: snapshot.val().username,
          groupSelection: groups.length <= 0 ? null : groups[0].groupID,
          groupSelectionForAddingToGroup: groups.length <= 0 ? null : groups[0].groupID,
          isInGroup: groups.length > 0,
          currentGroup: groups.length <= 0 ? '' : groups[0].groupName,
          currentGroupId: groups.length <= 0 ? '' : groups[0].groupID
        });
        const groupID = groups.length <= 0 ? '' : groups[0].groupID
        getChores(groupID).then((chores) => {
          this.setState({
            chores,
          });
        });
      });
    });
  }

  clickCreateGroup = () => {
    createGroup(this.state.addingGroupName, auth.currentUser.uid).then((gid) => {
      // console.log(gid);
      // // this.setState({
      // //   groups: groups.push(gid),
      // // });
      // database.ref(`groups/${gid}`).once('value').then((groupSnapshot) => {
      //   this.setState({
      //     groups: groupSnapshot.val(),
      //   });
      //   console.log(this.state);
      // });
    });
  }

  deleteGroup = (groupID) => {
    deleteGroup(auth.currentUser.uid, groupID).then((gid) => {
      getGroups(auth.currentUser.uid).then((value) => {
        this.setState({
          groups: value,
        });
      });
    });
  }

  deleteChore = (choreID) => {
    /*console.log(choreID);*/
    deleteChore(this.state.currentGroupId, choreID).then((value) => {
      getChores(this.state.currentGroupId).then((value) => {
        this.setState({
          chores: value,
        });
      });
    });
  }

  printButton = () => {
    console.log(this.state);
  }

  handleInputChange = (e) => {
    const { target } = e;
    const { value } = target;
    const { name } = target;
    this.setState({
      [name]: value,
    });
    this.printButton();
    console.log(value);
  }

  /* okay so bulma has limited color names, so i named the darker blue "warning"
the $milkyWhite is named "link" */
  /*old from dashboard*/
  /*render() {
    const { name, email, username } = this.state;*/
  /*new from admin*/
  render() {
    const {
        chores, username, groups, isInGroup, groupSelection,
        choreName, assignedToUsername, addingUsername, groupSelectionForAddingToGroup, currentGroup
      } = this.state;
    return (
      <div className="columns">
        {/* Left side of website, the sidebar */}
        <div className="column is-one-fifth">
          {/* Profile picture */}
          <figure className="image container is-128x128 has-text-centered">
            <img className="is-rounded" alt="user profile" src="https://bulma.io/images/placeholders/96x96.png" />
          </figure>
          {/* userid label directly under the profile pic */}
          <label className="label  has-text-centered has-text-link">{username}</label>

          <div className="box is-invisible is-marginless" />
          {/* "Your Places" label, trying to get it to look like Vania's design */}
          <div className="columns">
            <div className="column is-two-thirds has-background-warning ">
              <div className="block is-fullwidth has-background-warning">
                <label className="label is-pulled-right has-text-link">YOUR PLACES</label>
              </div>
            </div>
          </div>
            {!isInGroup ? (
              <div className="box has-background-link">
                <h1 className="is-size-4 has-text-primary">CREATE A GROUP TO GET STARTED</h1>
              </div>
            ):(
              <div className="box has-background-link">
                {groups.map(obj => (
                  <div className="buttons has-addons" key={obj.groupID}>
                  <span className="button has-background-link has-text-warning" onClick={() => this.switchGroup(obj.groupID)}>{obj.groupName}</span>
                  <span className="button is-danger" onClick={() =>this.deleteGroup(obj.groupID)}><FontAwesomeIcon icon="minus-circle" size="1x"/></span>
                </div>
                ))}
              </div>
            )}

          <div className="field has-addons has-addons-centered">
            <div className="control">
              <input className="input" name="addingGroupName" type="text" placeholder="GroupName" onChange={this.handleInputChange} />
            </div>
            <div className="control">
              <button className="button is-primary" type="button" onClick={this.clickCreateGroup}>
                <FontAwesomeIcon icon="plus-circle" size="1x"/>
              </button>
            </div>
          </div>
        </div>
        {/* Right side of website */}
        <div className="column">
          <div className="box has-background-link">
            {currentGroup === '' ? (
              <h1 className="title is-size-3 is-size-5-mobile has-text-centered has-text-warning">
                Welcome, {username}
              </h1>
            ):(
                <h1 className="title is-size-3 is-size-5-mobile has-text-centered has-text-warning">
                  Welcome to {currentGroup}, {username}
                </h1>
            )}
            {/* Center Visual: House Icon */}
            <figure className="image container is-480x800 has-text-centered">
              <FontAwesomeIcon icon="home" size="10x" color="#91C7CE" />
            </figure>
            <figure className="image container is-500x500 has-text-centered">
              <FontAwesomeIcon icon="tasks" size="2x" color="#B3D9DE" />
            </figure>
            {/* Box to fill up space lol */}
            <div className="box is-invisible is-paddingless" />
            <div className="field" />
            {/* Bottom 3 columns for tasks, members, edit house boxes */}
            <div className="columns">
              <div className="column is-one-third">
                <div className="box has-background-link">

                  <label className="label has-text-centered has-text-warning has-text-weight-normal">Tasks</label>
                  {/*Vybhav's additions*/}
                  {chores.length <= 0 ? (
                    <h1 className="is-size-8 has-text-primary has-text-centered">YOU'RE ALL DONE!</h1>
                  ) :(
                      <div className="buttons">
                        {chores.map(obj => (
                          <button className="button is-fullwidth has-text-left has-text-link has-background-warning" type="button" key={obj.choreID} onClick={() => this.deleteChore(obj.choreID)}>{obj.choreName}</button>
                        ))}
                      </div>
                  )}
                </div>
              </div>
              <div className="column is-one-third">
                <div className="box has-background-link">
                  <label className="label has-text-centered has-text-warning has-text-weight-normal">Members</label>
                    {!isInGroup ?(
                      <fieldset disabled>
                        <div className="field has-addons has-addons-centered">
                          <div className="control">
                            <input className="input" name="addingUsername" type="text" placeholder="User Name" onChange={this.handleInputChange} />
                          </div>
                          <div className="select has-text-warning">
                            <select name="groupSelectionForAddingToGroup has-text-warning" onChange={this.handleInputChange}>
                              {groups.map(obj => (
                                <option value={obj.groupID} key={obj.groupID}>{obj.groupName}</option>
                              ))}
                            </select>
                          </div>
                          <div className="control">
                            <button className="button is-primary" type="button" onClick={() => addUserToGroup(addingUsername, groupSelectionForAddingToGroup)}>
                              <FontAwesomeIcon icon="plus-circle" size="1x" color="#91C7CE" />
                            </button>
                          </div>
                        </div>
                      </fieldset>
                    ):(
                      <div className="field has-addons has-addons-centered">
                        <div className="control">
                          <input className="input" name="addingUsername" type="text" placeholder="User Name" onChange={this.handleInputChange} />
                        </div>
                        <div className="select has-text-warning">
                          <select name="groupSelectionForAddingToGroup has-text-warning" onChange={this.handleInputChange}>
                            {groups.map(obj => (
                              <option value={obj.groupID} key={obj.groupID}>{obj.groupName}</option>
                            ))}
                          </select>
                        </div>
                        <div className="control">
                          <button className="button is-primary" type="button" onClick={() => addUserToGroup(addingUsername, groupSelectionForAddingToGroup)}>
                            <FontAwesomeIcon icon="plus-circle" size="1x" color="#91C7CE" />
                          </button>
                        </div>
                      </div>
                  )}
                </div>
              </div>
              <div className="column is-one-third">
                {/* <button className="button is-fullwidth has-text-warning has-background-link">
                  <FontAwesomeIcon icon="edit" color="#91C7CE" />
                        Edit House
                </button> */}
                {/* <div className="box is-invisible is-paddingless" /> Spacer */}
                {/* Add chore button */}

                {/*Vybhav's chores*/}
                {!isInGroup ? (
                  <fieldset disabled>
                    <div className="field has-addons">
                      <div className="control is-link">
                        <input className="input" name="choreName" type="text" placeholder="Chore Name" />
                      </div>
                      <div className="control">
                        <a className="button is-primary">
                          Add Chore
                        </a>
                      </div>
                    </div>
                  </fieldset>
                ) : (
                  <div className="field "> /* has-addons*/
                    <div className="control">
                      <input className="input" name="choreName" type="text" placeholder="Chore Name" onChange={this.handleInputChange} />
                    </div>
                    <div className="control">
                      <input className="input" name="assignedToUsername" type="text" placeholder="User Name" onChange={this.handleInputChange} />
                    </div>
                    <div className="select ">
                      <select name="groupSelection" onChange={this.handleInputChange}>
                        {groups.map(obj => (
                          <option value={obj.groupID} key={obj.groupID}>{obj.groupName}</option>
                        ))}
                      </select>
                    </div>
                    <div className="control">
                      <button className="button is-primary" type="button" onClick={() => addChore(groupSelection, choreName, assignedToUsername)}>
                          <FontAwesomeIcon icon="plus-circle" size="1x" color="#91C7CE" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* <div className="field" /> */}
            {/* <div className="box is-invisible" /> */}
          </div>
        </div>
      </div>
    );
  }
}
export default withAuth(Dashboard);
