module.exports = async function handler(req, res) {
  const raw = 'https://raw.githubusercontent.com/archengservices2022/eventora-demo/main/index.html';
  const response = await fetch(raw, { cache: 'no-store' });
  let html = await response.text();

  const css = `
<style>
.role-workspace-panel{width:min(1040px,94vw);max-height:90vh;overflow:hidden;background:#fff;border-radius:28px;box-shadow:0 34px 100px rgba(11,16,32,.25);display:grid;grid-template-columns:220px 1fr;position:relative}.role-workspace-nav{background:#111728;color:#b9c0cf;padding:28px 18px}.role-workspace-nav .section-tag{display:block;margin-bottom:10px}.role-workspace-nav h3{color:#fff;margin:0 0 24px}.role-workspace-nav button{width:100%;border:0;background:transparent;color:inherit;text-align:left;padding:11px 12px;border-radius:10px;font-weight:700;margin:3px 0;cursor:pointer}.role-workspace-nav button.active,.role-workspace-nav button:hover{background:#293149;color:#fff}.role-workspace-main{padding:30px;overflow:auto}.role-workspace-main h2{font-family:'Playfair Display',serif;font-size:38px;margin:8px 0}.role-workspace-main>p{color:var(--muted);margin-top:0}.slot-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:20px}.slot-card{border:1px solid var(--line);border-radius:18px;padding:17px;background:#fff}.slot-card h4{margin:0 0 5px}.slot-card p{color:var(--muted);font-size:12px;line-height:1.55;margin:4px 0}.slot-card .slot-time{display:flex;justify-content:space-between;align-items:center;margin:14px 0}.slot-card .slot-time strong{font-size:15px}.appointment-table{display:grid;gap:10px;margin-top:20px}.appointment-row{display:grid;grid-template-columns:1.25fr .9fr .9fr .7fr auto;gap:10px;align-items:center;border:1px solid var(--line);border-radius:14px;padding:13px}.appointment-row strong,.appointment-row small{display:block}.appointment-row small{color:var(--muted);font-size:10px;margin-top:3px}.status-pill{display:inline-block;padding:6px 9px;border-radius:999px;background:#e8f4ec;color:#2e7c4c;font-size:9px;font-weight:800}.status-pill.cancelled{background:#f8e8e8;color:#9b3d3d}.status-pill.pending{background:#fff1d9;color:#8b6420}.empty-state{border:1px dashed #d6d9df;border-radius:18px;padding:28px;text-align:center;color:var(--muted);margin-top:20px}.role-summary{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:20px}.role-summary div{border:1px solid var(--line);border-radius:16px;padding:16px}.role-summary small{display:block;color:var(--muted)}.role-summary strong{display:block;font-size:24px;margin-top:5px}@media(max-width:760px){.role-workspace-panel{grid-template-columns:1fr;max-height:94vh}.role-workspace-nav{padding:16px;display:flex;gap:8px;align-items:center;overflow:auto}.role-workspace-nav .section-tag,.role-workspace-nav h3{display:none}.role-workspace-nav button{width:auto;white-space:nowrap}.role-workspace-main{padding:20px}.slot-grid{grid-template-columns:1fr}.appointment-row{grid-template-columns:1fr}.role-summary{grid-template-columns:1fr}}
</style>`;

  const workspace = `
<div class="modal" id="roleWorkspaceModal" aria-hidden="true">
  <div class="modal-backdrop" data-role-workspace-close="true"></div>
  <div class="role-workspace-panel">
    <button class="modal-close" data-role-workspace-close="true">×</button>
    <nav class="role-workspace-nav">
      <span class="section-tag light" id="roleWorkspaceLabel">CLIENT</span>
      <h3 id="roleWorkspaceName">My Event</h3>
      <button class="active" data-role-view="overview">Overview</button>
      <button data-role-view="appointments">Appointments</button>
    </nav>
    <main class="role-workspace-main" id="roleWorkspaceContent"></main>
  </div>
</div>`;

  const script = `
<script>
(function(){
const slots=[
{id:'cat-0822-1100',service:'Catering',vendor:'Saffron & Sage',date:'2026-08-22',time:'11:00 AM'},
{id:'cat-0822-0300',service:'Catering',vendor:'Saffron & Sage',date:'2026-08-22',time:'3:00 PM'},
{id:'photo-0824-0230',service:'Photography',vendor:'Northlight Studio',date:'2026-08-24',time:'2:30 PM'},
{id:'decor-0828-0500',service:'Decor',vendor:'Bloom & Beam',date:'2026-08-28',time:'5:00 PM'},
{id:'venue-0830-1000',service:'Venue',vendor:'The Conservatory',date:'2026-08-30',time:'10:00 AM'}
];
let appointments=JSON.parse(localStorage.getItem('eventora_appointments')||'[]');
let role='client',view='appointments';
const modal=document.getElementById('roleWorkspaceModal');
const content=document.getElementById('roleWorkspaceContent');
function save(){localStorage.setItem('eventora_appointments',JSON.stringify(appointments))}
function dateText(d){return new Date(d+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
function toast(m){if(window.showToast)window.showToast(m);else alert(m)}
window.openRoleWorkspace=function(r,v='appointments'){
 role=r;view=v;
 document.getElementById('roleWorkspaceLabel').textContent=r.toUpperCase();
 document.getElementById('roleWorkspaceName').textContent=r==='client'?'My Event':r==='vendor'?'Vendor Portal':'Admin Operations';
 document.querySelectorAll('[data-role-view]').forEach(b=>b.classList.toggle('active',b.dataset.roleView===v));
 render();modal.classList.add('open');modal.setAttribute('aria-hidden','false');
};
function close(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true')}
document.querySelectorAll('[data-role-workspace-close]').forEach(x=>x.onclick=close);
document.querySelectorAll('[data-role-view]').forEach(b=>b.onclick=function(){view=b.dataset.roleView;document.querySelectorAll('[data-role-view]').forEach(x=>x.classList.toggle('active',x===b));render()});
function render(){if(view==='overview')return overview();if(role==='client')client();else if(role==='vendor')vendor();else admin()}
function overview(){const booked=appointments.filter(a=>a.status!=='Cancelled').length;const title=role==='client'?'Your event workspace':role==='vendor'?'Saffron & Sage':'Eventora operations';content.innerHTML='<span class="section-tag">'+role.toUpperCase()+' OVERVIEW</span><h2>'+title+'</h2><p>Appointments are connected across Client, Vendor and Admin in this demo.</p><div class="role-summary"><div><small>Booked appointments</small><strong>'+booked+'</strong></div><div><small>Available slots</small><strong>'+slots.length+'</strong></div><div><small>Status</small><strong style="font-size:17px">Live demo</strong></div></div><button class="dark-btn" id="openAppointments" style="margin-top:20px">Open appointments</button>';document.getElementById('openAppointments').onclick=function(){view='appointments';document.querySelectorAll('[data-role-view]').forEach(x=>x.classList.toggle('active',x.dataset.roleView==='appointments'));render()}}
function client(){const mine=appointments.filter(a=>a.client==='Olivia & Noah');const booked=new Set(appointments.filter(a=>a.status!=='Cancelled').map(a=>a.slotId));content.innerHTML='<span class="section-tag">CLIENT • APPOINTMENTS</span><h2>Book an appointment.</h2><p>Choose an available vendor slot. Once booked, it appears for Admin and the assigned Vendor.</p><div class="slot-grid">'+slots.map(s=>'<article class="slot-card"><h4>'+s.service+'</h4><p>'+s.vendor+'</p><div class="slot-time"><strong>'+dateText(s.date)+' • '+s.time+'</strong><span class="status-pill '+(booked.has(s.id)?'pending':'')+'">'+(booked.has(s.id)?'Booked':'Available')+'</span></div><button class="'+(booked.has(s.id)?'soft-btn':'dark-btn')+' full" '+(booked.has(s.id)?'disabled':'')+' data-book-slot="'+s.id+'">'+(booked.has(s.id)?'Slot booked':'Book appointment')+'</button></article>').join('')+'</div><h3 style="margin-top:28px">My appointments</h3>'+(mine.length?'<div class="appointment-table">'+mine.map(a=>'<div class="appointment-row"><div><strong>'+a.service+'</strong><small>'+a.vendor+'</small></div><div><strong>'+dateText(a.date)+'</strong><small>'+a.time+'</small></div><div><span class="status-pill '+(a.status==='Cancelled'?'cancelled':'')+'">'+a.status+'</span></div><div><small>'+a.event+'</small></div><button class="soft-btn" '+(a.status==='Cancelled'?'disabled':'')+' data-cancel-id="'+a.id+'">Cancel</button></div>').join('')+'</div>':'<div class="empty-state">No appointments booked yet.</div>');document.querySelectorAll('[data-book-slot]').forEach(b=>b.onclick=function(){book(b.dataset.bookSlot)});document.querySelectorAll('[data-cancel-id]').forEach(b=>b.onclick=function(){cancel(Number(b.dataset.cancelId))})}
function book(id){const s=slots.find(x=>x.id===id);if(!s)return;appointments.push({id:Date.now(),slotId:s.id,client:'Olivia & Noah',event:'Olivia & Noah Wedding',service:s.service,vendor:s.vendor,date:s.date,time:s.time,status:'Booked'});save();toast('Appointment booked — Admin and Vendor can now see it');render()}
function cancel(id){const a=appointments.find(x=>x.id===id);if(a){a.status='Cancelled';save();toast('Appointment cancelled');render()}}
function vendor(){const name='Saffron & Sage';const assigned=appointments.filter(a=>a.vendor===name);content.innerHTML='<span class="section-tag">VENDOR • APPOINTMENTS</span><h2>'+name+' schedule.</h2><p>Only appointments assigned to this vendor are shown.</p>'+(assigned.length?'<div class="appointment-table">'+assigned.map(a=>'<div class="appointment-row"><div><strong>'+a.client+'</strong><small>'+a.event+'</small></div><div><strong>'+a.service+'</strong><small>'+dateText(a.date)+' • '+a.time+'</small></div><div><span class="status-pill '+(a.status==='Cancelled'?'cancelled':'')+'">'+a.status+'</span></div><div><small>Assigned to you</small></div><button class="soft-btn" '+(a.status==='Cancelled'?'disabled':'')+' data-confirm-id="'+a.id+'">Confirm</button></div>').join('')+'</div>':'<div class="empty-state">No client bookings assigned to Saffron & Sage yet. Book a Catering slot from Client → Appointments to see it here.</div>');document.querySelectorAll('[data-confirm-id]').forEach(b=>b.onclick=function(){confirmAppt(Number(b.dataset.confirmId))})}
function admin(){content.innerHTML='<span class="section-tag">ADMIN • APPOINTMENTS</span><h2>All appointment bookings.</h2><p>Admin sees the client, event, vendor/service, date/time and current status.</p>'+(appointments.length?'<div class="appointment-table">'+appointments.map(a=>'<div class="appointment-row"><div><strong>'+a.client+'</strong><small>'+a.event+'</small></div><div><strong>'+a.service+'</strong><small>'+a.vendor+'</small></div><div><strong>'+dateText(a.date)+'</strong><small>'+a.time+'</small></div><div><span class="status-pill '+(a.status==='Cancelled'?'cancelled':'')+'">'+a.status+'</span></div><button class="soft-btn" '+(a.status==='Cancelled'?'disabled':'')+' data-admin-confirm="'+a.id+'">Confirm</button></div>').join('')+'</div>':'<div class="empty-state">No client appointment bookings yet.</div>');document.querySelectorAll('[data-admin-confirm]').forEach(b=>b.onclick=function(){confirmAppt(Number(b.dataset.adminConfirm))})}
function confirmAppt(id){const a=appointments.find(x=>x.id===id);if(a){a.status='Confirmed';save();toast('Appointment status updated');render()}}
const loginForm=document.getElementById('roleLoginForm');if(loginForm)loginForm.addEventListener('submit',function(){setTimeout(function(){const r=document.getElementById('selectedRole').value;openRoleWorkspace(r,'appointments')},80)});
document.querySelectorAll('[data-preview-role]').forEach(btn=>btn.addEventListener('click',function(){openRoleWorkspace(btn.dataset.previewRole,'appointments')}));
})();
</script>`;

  html = html.replace('</head>', css + '</head>');
  html = html.replace('</body>', workspace + script + '</body>');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.status(200).send(html);
};
