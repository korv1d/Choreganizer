import React from 'react';
import router from 'next/router';
import { auth } from '../firebase';

const authComp = Component => class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'LOADING',
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        this.setState({
          status: 'SIGNED_IN',
        });
      } else {
        router.push('/');
      }
    });
  }

  renderContent() {
    const { status } = this.state;
    if (status == 'LOADING') {
      return (<div className="container" style={{ padding: '5%' }}><progress className="progress is-small is-info" max="100">10%</progress></div>);
    } if (status == 'SIGNED_IN') {
      return <Component {...this.props} />;
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.renderContent()}
      </React.Fragment>
    );
  }
};
export default authComp;
