import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LoginContainer from '../containers/LoginContainer';
import Button from "../components/Button";

const buttonStyle = {
    fontFamily: 'Amatic SC',
    fontWeight: 'bold',
    color: 'white',
    backgroundImage: '-moz-linear-gradient(30deg, #F9BE02, #F53240)',
    backgroundImage: '-webkit-linear-gradient(30deg, #F9BE02, #F53240)',
    backgroundImage: ':-o-linear-gradient(30deg, #F9BE02, #F53240)',
    backgroundImage: 'linear-gradient(60deg, #F9BE02, #F53240)',
    border: 'none',
    paddingLeft: '30px',
    paddingRight: '30px'
  };

  const buttonStyleSubmit = {
    fontFamily: 'Amatic SC',
    fontWeight: 'bold',
    color: 'white',
    backgroundImage: '-moz-linear-gradient(30deg, #F9BE02, #F53240)',
    backgroundImage: '-webkit-linear-gradient(30deg, #F9BE02, #F53240)',
    backgroundImage: ':-o-linear-gradient(30deg, #F9BE02, #F53240)',
    backgroundImage: 'linear-gradient(60deg, #F9BE02, #F53240)',
	borderRadius: '30px',
	border: 'none',
    paddingLeft: '30px',
	paddingRight: '30px',
	fontSize: '18px'
  };

const buttonTitle = {
    fontFamily: 'Amatic SC',
    fontWeight: 'bold',
    color: '#F9BE02',
    fontSize: '50px'
  };

class Header extends Component{
	constructor(props) {
		super(props);
		this.showModal = this.showModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	  }

	showModal() {
		document.getElementById('modal1').classList.add("is-active");
	}
	
	closeModal() {
		document.getElementById('modal1').classList.remove("is-active");
	}	


    render() {
        return (
            <nav className="navbar">

                <div className="navbar-brand">

                    <a className="navbar-item" style={buttonTitle}>
                       <span> MATCHA </span>
                    </a>

                    <div className="navbar-burger burger" data-target="mobile-app">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>

                <div id="mobile-app" className="navbar-menu">
                    <div className="navbar-start">


                    </div>
                </div>

                <div className="navbar-end">

                    <div className="navbar-item">
                        <Button class="button is-rounded" title="Log In" action={this.showModal} style={buttonStyle}/>
                    </div>
                    <div className="modal" id="modal1">
			        <div className="modal-background"></div>
			        <div className="modal-card">
				        <header className="modal-card-head">
				            <p className="modal-card-title">Log In</p>
				            <button className="delete" aria-label="close" onClick={this.closeModal}></button>
				        </header>
				        <section className="modal-card-body">
				 	        <LoginContainer />
                             <a href="#">Forgot your password ?</a>
				        </section>
				        <footer className="modal-card-foot">
					        <Button className="button is-rounded" title="submit" style={buttonStyleSubmit}/>
				        </footer>
			        </div>
			        </div>

                </div>

            </nav>
        );
    }
}

export default Header;