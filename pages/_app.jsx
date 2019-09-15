import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
import Navbar from '../components/Navbar'
import '../styles/application.scss';

import ReactDOM from 'react-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faCheckSquare, faCoffee, faHome, faTasks, faPlusCircle, faEdit, faCheck, faMinusCircle} from '@fortawesome/free-solid-svg-icons'

library.add(fab, faCheckSquare, faCoffee, faHome, faTasks, faPlusCircle, faEdit, faCheck, faMinusCircle)

export default class extends App {
  render() {
    const { Component } = this.props;

    return (
      <Container>
        <Head>
          <title>choreganizer</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" hid="description" content="handle your chores." />
        </Head>
        <Navbar />
        <Component />
      </Container>
    );
  }
}
