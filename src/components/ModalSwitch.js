import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

class ModalSwitch extends React.Component {

    componentWillUpdate(nextProps) {
        const { location } = this.props;
        // set previousLocation if props.location is not modal
        if (
          nextProps.history.action !== "POP" &&
          (!location.state || !location.state.modal)
        ) {
          this.previousLocation = this.props.location;
        }
    }

    render() {
        const { location } = this.props;
        const isModal = !!(
          location.state &&
          location.state.modal &&
          this.previousLocation !== location
        ); // not initial render
        return (
          <div>
            <Switch location={isModal ? this.previousLocation : location}>
              <Route exact path="/" component={Home} />
              <Route path="/gallery" component={Gallery} />
              <Route path="/img/:id" component={ImageView} />
            </Switch>
            {isModal ? <Route path="/img/:id" component={Modal} /> : null}
          </div>
        );
    }

}