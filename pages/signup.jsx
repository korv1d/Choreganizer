import React from 'react';
import router from 'next/router';
import { auth, database } from '../src/firebase';

export default class signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '', username: '', password: '', confirmedPass: '',
    };
  }

  handleSignUp = () => {
    const {
      email, username, password, confirmedPass,
    } = this.state;
    let usernameExists = false;
    database.ref(`usernames/${username.toLowerCase()}`).once('value', (snapshot) => {
      if (snapshot.exists()) {
        usernameExists = true;
      }
    }).then(() => {
      if (password !== confirmedPass) {
        this.resetStates();
        alert("Passwords don't match");
      } else if (usernameExists) {
        this.resetStates();
        alert('Username Exists');
      } else {
        auth.createUserWithEmailAndPassword(email, password).then(() => {
          const { uid } = auth.currentUser;
          database.ref(`users/${uid}`).set({
            email,
            username,
          });
          database.ref(`usernames/${username.toLowerCase()}`).set({
            uid,
            email,
          }).then(() => {
            router.push('/dashboard');
          });
        }).catch((err) => {
          this.resetStates();
          alert(err.message);
        });
      }
    })
  }

  resetStates = () => {
    this.setState({
      email: '',
      username: '',
      password: '',
      confirmedPass: ''
    });
  }
  handleInputChange = (e) => {
    const { target } = e;
    const { value } = target;
    const { name } = target;
    this.setState({
      [name]: value,
    });
  }

  render() {
    const {username, password, email, confirmedPass} = this.state;
    return (
      <div className="columns is-centered">
        <div className="column is-two-fifths">
          <div className="box">
            <h1 className="title is-size-3 is-size-5-mobile has-text-centered has-text-primary">
              WELCOME TO CHOREGANIZER!
            </h1>
            <div className="field">
              <label className="label has-text-primary">USERNAME</label>
              <div className="control">
                <input className="input" name="username" value={username} type="text" onChange={this.handleInputChange} placeholder="choreboiz" />
              </div>
            </div>
            <div className="field">
              <label className="label has-text-primary">EMAIL</label>
              <div className="control">
                <input className="input" name="email" value={email} type="email" onChange={this.handleInputChange} placeholder="choreboiz@choreganizer.com" />
              </div>
            </div>
            <label className="label has-text-primary">PASSWORD</label>
            <div className="field is-horizontal">
              <div className="field-body">
                <div className="field">
                  <p className="control is-expanded">
                    <input className="input" name="password" value={password} type="password" onChange={this.handleInputChange} placeholder="Enter Password" />
                  </p>
                </div>
                <div className="field">
                  <p className="control is-expanded">
                    <input className="input" name="confirmedPass" value={confirmedPass} type="password" onChange={this.handleInputChange} placeholder="Confirm Password" />
                  </p>
                </div>
              </div>
            </div>
            <div className="field">
              <p className="control">
                <button className="button is-primary is-rounded is-fullwidth" type="submit" onClick={this.handleSignUp}>
                  SUBMIT
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
