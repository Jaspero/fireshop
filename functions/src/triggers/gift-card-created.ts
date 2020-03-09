import * as functions from 'firebase-functions';
import {firestore} from 'firebase-admin';
import {parseEmail} from '../utils/parse-email';

export const giftCardCreated = functions.firestore
  .document('gift-cards-instances/{id}')
  .onCreate(async giftCard => {
    if (!giftCard) return false;

    const giftCardData = giftCard.data() || {};

    const parentGiftCardId = giftCardData.parentGiftCard;
    const parentGiftCardRef = await firestore()
      .doc(`gift-cards/${parentGiftCardId}`)
      .get();
    const currency = (parentGiftCardRef.data() || {}).currency;
    const values = (parentGiftCardRef.data() || {}).values;

    await giftCard.ref.set({value: values[currency]}, {merge: true});

    await parseEmail(
      giftCardData.email,
      'Jaspero Fireshop - Gift Card',
      'gift-card-success',
      {
        value: values['GBP'] / 100,
        code: giftCardData.code
      }
    );

    return true;
  });
