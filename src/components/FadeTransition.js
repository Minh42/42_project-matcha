import React from 'react';
import { CSSTransition } from 'react-transition-group';

const FadeTransition = (props) => (
    <CSSTransition
      {...props}
      classNames="messages"
      timeout={{ enter: 500, exit: 300 }}
    />
);

export default FadeTransition;