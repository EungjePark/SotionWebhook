const axios = require('axios');
const { logs } = require('../logsStore');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { type, payment } = req.body;

  const entry = {
    timestamp: Date.now(),
    type,
    email: payment?.email || '',
    status: payment?.status || 'UNKNOWN',
  };
  logs.push(entry);                  // ← 로그 추가

  try {
    if (
      (type === 'NORMAL_PAYMENT' || type === 'MEMBERSHIP_PAYMENT') &&
      payment.status === 'SUCCESS' &&
      payment.email
    ) {
      await axios.post(
        'https://1a54cfd9-c54f-4683-90bc-79dfdcf4d6ff.api.sotion.app/sites/EAUFWUURGJOUU/members',
        { email: payment.email, paid: true }
      );
      console.log(`✅ 등록 완료: ${payment.email}`);
      entry.status = 'OK';            // 성공 상태로 업데이트
    }
  } catch (err) {
    console.error(err);
    entry.status = 'ERROR';           // 에러 상태로 업데이트
  }

  res.status(200).send('Webhook received');
};