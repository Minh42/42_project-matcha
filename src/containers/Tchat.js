import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Tchat extends Component {

	render () {
		return (
			<section className="hero is-fullheight sectionTchat">
				<div className="hero-head">
					<p>hello</p>
				</div>
				<div className="hero-body">
					{/* <div className="container"> */}
					
					{/* </div> */}
				</div>
				<div className="hero-foot columns">
					<div className="input_msg_write column is-9">
						<input type="text" className="write_msg" placeholder="Type a message" />
					</div>
					<div className="column is-1">
						<button className="button msg_send_btn" type="button">Send</button>
					</div>
				</div>
			</section>
		)
	}

}

export default Tchat