const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const body = req.body;

  try {
    const type = body.type;
    const payment = body.payment;

    if (
      (type === 'NORMAL_PAYMENT' || type === 'MEMBERSHIP_PAYMENT') &&
      payment?.status === 'SUCCESS' &&
      payment?.email
    ) {
      const email = payment.email;

      await axios.post(
        'https://1a54cfd9-c54f-4683-90bc-79dfdcf4d6ff.api.sotion.app/sites/EAUFWUURGJOUU/members',
        {
          email: email,
          paid: true
        }
      );

      console.log(`✅ 등록 완료: ${email}`);
    } else {
      console.log('📌 처리 대상 아님:', type, payment?.status);
    }

    res.status(200).send('Webhook received');
  } catch (error) {
    console.error('❌ 에러:', error.response?.data || error.message);
    res.status(500).send('Internal Server Error');
  }
};