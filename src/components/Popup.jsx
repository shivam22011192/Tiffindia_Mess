import React, { Component } from 'react';

class Popup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: true,
    };
  }

  handleClose = () => {
    this.props.setPopupVisible()
    this.setState({ isVisible: false });
  };

  render() {
    const { message } = this.props;
    const { isVisible } = this.state;

    if (!isVisible) return null;

    return (
      <div style={styles.overlay}>
        <div style={styles.popup}>
          <p>{message}</p>
          <button onClick={this.handleClose} style={styles.button}>Cancel</button>
        </div>
      </div>
    );
  }
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  popup: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    minWidth: '300px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
  },
  button: {
    marginTop: '15px',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#f44336',
    color: '#fff',
    cursor: 'pointer',
  },
};

export default Popup;
