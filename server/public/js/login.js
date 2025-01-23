/* eslint-disable */
import axios from 'axios';
import { showAlert } from './showAlert';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password
      }
    });
    if (res.data.status === 'success') {
      console.log('res.data', res.data);
      showAlert('primary', 'Login successful', 'color:black;', 'alert-container');
      window.setTimeout(() => {
        location.assign('/');
      }, 800);
    }
  } catch (err) {
    if (err.response) {
      showAlert('danger', err.response.data.message, 'color:black;', 'alert-container');
    } else {
      showAlert('danger', 'Something went wrong. Please try again.', 'color:black;', 'alert-container');
    }
  }
  
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout'
    });
    if (res.data.status === 'success') location.reload(true);
  } catch (err) {
    console.log(err.response);
    showAlert('danger', 'Error logging out! Try again.', 'color:black;', 'alert-container');
  }
};

