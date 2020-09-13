/*eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const updateSettings = async (data, type) => {
  try {
    const urlPart = type === 'password' ? 'updateMyPassword' : 'updateMe';
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/${urlPart}`,
      data
    });
    // console.log(res);
    //FOR UPDATE DATA
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
      location.reload(true);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    //console.log(err.response);
  }
};
