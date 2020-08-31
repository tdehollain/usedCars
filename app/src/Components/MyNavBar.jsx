import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavbarGroup, Alignment, NavbarHeading, NavbarDivider, Button } from '@blueprintjs/core';

export default class MyNavBar extends Component {
  render() {
    return (
      <Navbar className=''>
        <NavbarGroup align={Alignment.LEFT}>
          <NavbarHeading>Used Cars</NavbarHeading>
          <NavbarDivider />
          <Link to='/'><Button className='pt-minimal navbar-link' icon='grouped-bar-chart' text='Analytics' /></Link>
          <Link to='/admin'><Button className='pt-minimal navbar-link' icon='cog' text='Admin' /></Link>
        </NavbarGroup>
      </Navbar>
    )
  }
}