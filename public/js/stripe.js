/* eslint-disable */
import axios from 'axios';
const stripe = Stripe('pk_test_9DVLGrEmCkv5M98RFzeRWDQp00Ds27EpKA');
import { showAlert } from './alert';

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      //TOUR ID COMES FROM TOUR.PUG & INDEX.JS VIA DATASET
      `http://127.0.0.1:3000/api/v1/booking/checkout-session/${tourId}`
    );
    //console.log(session);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
