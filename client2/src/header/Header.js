import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

export class Header extends Component {
	render() {
		return (
			<div>
				<>
				  <Navbar bg="dark" variant="dark">
				    <Navbar.Brand href="/">SAASIFY</Navbar.Brand>
				    <Nav className="mr-auto">
				      <Nav.Link href="/">Home</Nav.Link>
				      <Nav.Link href="#features">Features</Nav.Link>
				      <Nav.Link href="#pricing">Pricing</Nav.Link>
				    </Nav>
				  </Navbar>
				</>
			</div>
		);
	}
}

export default Header;
