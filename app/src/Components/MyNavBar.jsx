import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavbarGroup, Alignment, NavbarHeading, NavbarDivider, Button } from '@blueprintjs/core';

const MyNavBar = props => (
  <Navbar className=''>
    <NavbarGroup align={Alignment.LEFT}>
      <NavbarHeading>Used Cars</NavbarHeading>
      <NavbarDivider />
      <Link to='/'><Button className='pt-minimal navbar-link' icon='grouped-bar-chart' text='Analytics' /></Link>
      <Link to='/admin'><Button className='pt-minimal navbar-link' icon='cog' text='Admin' /></Link>
    </NavbarGroup>
  </Navbar>
);

export default MyNavBar;