require("../assets/stylesheets/styles.scss");

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux'
import { createStore } from 'redux'
import todoApp from './reducers'

import Header from './layout/Header';
import Content from './layout/Content';
import Footer from './layout/Footer';

const App = () => {
    return (
        <div>
            <Header/>
            <Content/>
            <Footer/>
        </div>
    );
}

ReactDOM.render(<App />, document.querySelector('.root'));