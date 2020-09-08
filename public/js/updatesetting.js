/*eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const updateData = async (name, email) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://127.0.0.1:3000/api/v1/users/updateMe',
      data: {
        name,
        email
      }
    });
    console.log(res);
    //FOR UPDATE DATA
    if (res.data.status === 'success') {
      showAlert('success', `data update successfully`);
      location.reload(true);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    //console.log(err.response);
  }
};
