require("../assets/stylesheets/styles.scss");

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import registerServiceWorker from './registerServiceWorker';
import App from './App';
import Header from './layout/Header';
import Content from './layout/Content';
import Footer from './layout/Footer';
import FormContainer from './containers/FormContainer';

const App = () => {
    return (
        <div>
            <Header/>
            <Content/>
            {/* <Footer/> */}
        </div>
    );
}

ReactDOM.render(<App />, document.querySelector('.root'));