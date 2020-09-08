/*eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';

//DOM
const mapBox = document.getElementById('map');
const formData = document.querySelector('.form--login');
const userLogoutBtn = document.querySelector('.nav__el--logout');

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
  // what will put data in data-locations (locations) is field and you can access locations data using dataset
}

//ACCESS VIEW BY DOM
if (formData) {
  formData.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

//WHEN USER LOGOUT
if (userLogoutBtn) {
  userLogoutBtn.addEventListener('click', logout);
}
