/* BWPay — the "get this pack" action.

   INTERIM: there is no payment gateway yet, so this opens a WhatsApp chat with
   the business, pre-filled with the account email and the pack, so Samar can
   collect payment (UPI / in person) and send back an activation code. When
   Razorpay goes live, whatsappActivate() is replaced by a real checkout launch;
   the button on the page calls BWPay and does not change. */
window.BWPay = (function () {
  'use strict';

  function whatsappActivate(email, packKey) {
    var pack = BW_APP.PACKS[packKey];
    var msg =
      'Hi, I want the ' + pack.name + ' (' + pack.priceLabel + ') on budgetwebsite.store.\n' +
      'My account email: ' + email + '\n' +
      'Please tell me how to pay and get my activation code.';
    window.open('https://wa.me/' + BW_APP.WHATSAPP + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  }

  return { whatsappActivate: whatsappActivate };
})();
