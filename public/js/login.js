/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

//SET GLOBAL CREDENTIALS IN AXIOS REQUEST
axios.defaults.withCredentials = true;

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
    //console.log(res);
    //IF USER LOGIN ALERT SUCCESS MESSAGE AND REDIRECT HOME(/) PAGE
    if (res.data.status === 'success') {
      const userName = res.data.data.user.name;

      showAlert('success', `Logged in successfully welcome ${userName}!`);
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    //console.log(err.response);
  }
};
export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout'
    });

    //IF USER logout ALERT SUCCESS MESSAGE
    if (res.data.status === 'success') {
      showAlert('error', `Logged out successfully. Bye-Bye see you again`);
      location.reload(true);
    }
  } catch (err) {
    showAlert('error', 'something went wrong');
    //console.log(err.response);
  }
};
