/*eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updatesetting';

//DOM
const mapBox = document.getElementById('map');
const formData = document.querySelector('.form--login');
const userUpdateBtn = document.querySelector('.form-user-data');
const passwordUpdateForm = document.querySelector('.form-user-password');
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

//FOR USER DATA UPDATE
if (userUpdateBtn) {
  userUpdateBtn.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateSettings({ name, email }, 'data');
  });
}
//FOR UPDATE USER CURRENT PASSWORD
if (passwordUpdateForm) {
  passwordUpdateForm.addEventListener('submit', async e => {
    e.preventDefault();
    //FOR CHANGE BTN TEXT
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const currentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { currentPassword, password, passwordConfirm },
      'password'
    );
    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}
