/* eslint-disable */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '../scss/style.scss';
// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'
import { displayMap } from './leafletmap.js';
import { login } from './login.js';
import { logout } from './login.js';
import { showAlert } from './showAlert.js';


const mapBox = document.getElementById('map');
if (mapBox) {
    const locations = JSON.parse(document.getElementById('map').dataset.locations);
    displayMap(locations);
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');
    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
      });
    }
  });

const loginButton = document.getElementById('login-button');
const signupButton = document.getElementById('signup-button');
const logoutButton = document.getElementById('logoutbtn');
if (loginButton && signupButton) {
  console.log('loginButton', loginButton);
  loginButton.addEventListener('click', function() {
      location.assign('/login');
  });

  signupButton.addEventListener('click', function() {
      location.assign('/signup');
  });
}
if (logoutButton) {
  logoutButton.addEventListener('click', logout);
}
