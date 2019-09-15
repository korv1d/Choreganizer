import React from 'react';
import Link from 'next/link';
import classnames from 'classnames';
import { router, withRouter } from 'next/router';
import PropTypes from 'prop-types';
import { auth } from '../src/firebase';

class Navbar extends React.Component {
  isMounted = false;

  state = {
    active: false,
    isAuth: false,
  };

  static propTypes = {
    router: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
  }

  componentDidMount() {
    this.isMounted = true;
    auth.onAuthStateChanged((authUser) => {
      if (this.isMounted) {
        if (authUser) {
          this.setState({
            isAuth: true,
          });
        } else {
          this.setState({
            isAuth: false,
          });
        }
      }
    });
  }

  componentWillUnmount() {
    this.closeMenu();
    this.isMounted = false;
  }

  toggleMenu = () => {
    this.setState(prevState => ({
      active: !prevState.active,
    }));
  }

  closeMenu = () => {
    this.setState({
      active: false,
    });
  }

  handleLogout = () => {
    auth.signOut().then(() => {
      // router.push('/');
    }).catch((err) => {
      alert(err);
    });
  }


  render() {
    const { active, isAuth } = this.state;
    const { router: { pathname: route } } = this.props;

    return (
      <nav id="main-navbar" className="navbar is-primary">
        <div className="navbar-brand">
          <Link href="/">
            <a className="navbar-item has-text-weight-bold" role="navigation" onClick={this.closeMenu}>
              <span className="is-size-5">CHOREGANIZER</span>
            </a>
          </Link>

          <div className={classnames('navbar-burger', 'burger', { 'is-active': active })} role="navigation" onClick={this.toggleMenu}>
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className={classnames('navbar-menu', 'header', { 'is-active': active })}>
          <div className="navbar-end">
            {isAuth ? (
              <div className="field navbar-item">
                  <p className="control">
                    <Link href="/dashboard">
                      <a className={classnames('button', 'is-fullwidth', 'is-rounded', ' is-primary', { 'is-active': route === '/dashboard' })} role="navigation" >DASHBOARD</a>
                    </Link>
                  </p>
                  <p className="control">
                    <Link href="/">
                      <a className={classnames('button', 'is-fullwidth', 'is-rounded', ' is-danger', { 'is-active': route === '/' })} role="navigation" onClick={this.handleLogout}>LOGOUT</a>
                    </Link>
                  </p>
                </div>
            ) : (
                <div className="field navbar-item is-grouped">
                  <p className="control">
                    <Link href="/signup">
                      <a className="button is-fullwidth is-primary is-rounded" role="navigation" onClick={this.closeMenu}>
                        <strong>SIGN UP</strong>
                      </a>
                    </Link>
                  </p>
                  <p className="control">
                    <Link href="/login">
                      <a className="button is-fullwidth has-text-primary is-rounded is-inverted is-outlined" role="navigation" onClick={this.closeMenu}>
                        LOG IN
                      </a>
                    </Link>
                  </p>
                </div>
              )}
          </div>
        </div>
      </nav>
    );
  }
}

export default withRouter(Navbar);
