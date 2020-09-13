/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

//SET GLOBAL CREDENTIALS IN AXIOS REQUEST
axios.defaults.withCredentials = true;

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm
      }
    });
    //console.log(res);
    if (res.data.status === 'success') {
      const userName = res.data.data.user.name;
      showAlert('success', `user registered successfully welcome ${userName}!`);
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    //console.log(err.response);
  }
};
