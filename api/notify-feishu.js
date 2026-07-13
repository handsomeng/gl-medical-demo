// 收到预约后转发一条文本消息到飞书群机器人。Webhook 地址存在环境变量 FEISHU_WEBHOOK_URL，
// 不写进前端代码，避免 webhook 暴露在页面源码里被任意调用。
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method not allowed' });
    return;
  }
  const webhook = process.env.FEISHU_WEBHOOK_URL;
  if (!webhook) {
    res.status(500).json({ ok: false, error: 'FEISHU_WEBHOOK_URL not configured' });
    return;
  }

  let body = req.body;
  if (!body || typeof body === 'string') {
    try { body = JSON.parse(body || '{}'); } catch { body = {}; }
  }

  const {
    id = '', proj = '', hosp = '', region = '', date = '', time = '',
    price = '', name = '', phone = '', referrer = '',
  } = body;

  const lines = [
    'GOLONG 新预约提醒',
    `预约单号：${id}`,
    `姓名：${name}`,
    `手机号：${phone}`,
    `项目：${proj}`,
    `机构：${hosp}（${region}）`,
    `预约时段：${date} ${time}`,
    `费用：${price}`,
  ];
  if (referrer && String(referrer).trim()) lines.push(`预约达人：${referrer}`);

  try {
    const r = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ msg_type: 'text', content: { text: lines.join('\n') } }),
    });
    const data = await r.json().catch(() => ({}));
    res.status(200).json({ ok: true, feishu: data });
  } catch (err) {
    res.status(502).json({ ok: false, error: String(err) });
  }
}
