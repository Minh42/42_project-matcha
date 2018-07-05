import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Header from '../layout/Header';
import Content from '../layout/Content';
import Footer from '../layout/Footer';

class App extends Component {
    render() {
        return (
            <div>
                <Header/>
                <Content/>
                <Footer/>
            </div>
        );
    }
}

export default App;