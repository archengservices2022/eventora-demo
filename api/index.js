module.exports = async function handler(req, res) {
  const raw = 'https://raw.githubusercontent.com/archengservices2022/eventora-demo/main/index.html';
  const response = await fetch(raw, { cache: 'no-store' });
  let html = await response.text();
  const css = `<style>
  .apptSection{background:#fff;border:1px solid var(--line);border-radius:20px;padding:22px;margin-top:18px}.apptHead{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:18px}.apptHead h2{font-size:27px;margin:7px 0 0}.apptHead p{color:var(--muted);font-size:12px}.apptSlots{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.apptCard{border:1px solid var(--line);border-radius:16px;padding:16px;display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center}.apptCard .btn{grid-column:1/-1;width:100%}.apptIcon{width:42px;height:42px;border-radius:12px;background:var(--cream);display:grid;place-items:center}.apptCard h3{margin:0;font-size:15px}.apptCard p,.apptRow small{display:block;color:var(--muted);font-size:10px;margin:3px 0}.apptTime{text-align:right}.apptTime b,.apptTime span{display:block;font-size:11px}.apptList{display:grid;gap:9px}.apptRow{display:grid;grid-template-columns:1.2fr .8fr .6fr auto;gap:12px;align-items:center;border:1px solid var(--line);border-radius:13px;padding:13px}.apptRow.admin{grid-template-columns:1.1fr 1fr .8fr .6fr auto}.apptStatus{display:inline-block;border-radius:999px;padding:6px 9px;font-size:9px;font-weight:800;background:#fff1d9;color:#8b6420}.apptStatus.confirmed{background:#e8f4ec;color:#2f6f4b}.apptStatus.cancelled{background:#fff0f0;color:#a54848}.apptEmpty{padding:30px;border:1px dashed var(--line);border-radius:14px;text-align:center;color:var(--muted)}@media(max-width:700px){.apptSlots{grid-template-columns:1fr}.apptHead{align-items:flex-start;flex-direction:column}.apptRow,.apptRow.admin{grid-template-columns:1fr}.layout{grid-template-columns:1fr!important}aside{display:block!important;overflow-x:auto;white-space:nowrap;padding:10px!important}aside h3{display:none}#sideNav{display:flex;gap:5px}aside button{display:inline-block!important;width:auto!important;white-space:nowrap}.main{padding:18px!important}}
  </style>`;
  html = html.replace('</head>', css + '</head>');
  html = html.replace('</body>', '<script src="/appointment-flow.js?v=3"></script></body>');
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('Cache-Control','no-store, max-age=0');
  res.status(200).send(html);
};
