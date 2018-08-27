import React, {Component} from 'react'

const withInfiniteScroll = (WrappedComponent) =>
  class WithInfiniteScroll extends Component {
    componentDidMount() {
      window.addEventListener('scroll', this.onScroll, false);
    }

    componentWillUnmount() {
      window.removeEventListener('scroll', this.onScroll, false);
    }

    onScroll = () => {
      if (
        (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500) &&
        this.props.list.length
      ) {
        this.props.onPaginatedSearch();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
}