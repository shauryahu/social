import { spawn } from 'node:child_process';
import fs from 'node:fs';

const p = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9277',
  '--window-size=1440,900',
  'about:blank'
]);

setTimeout(async () => {
  try {
    const v = await fetch('http://127.0.0.1:9277/json/version').then(r => r.json());
    const ws = new WebSocket(v.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);
    let id = 1;
    const send = (m, p = {}) => new Promise(res => {
      const cur = id++;
      const h = (e) => {
        const d = JSON.parse(e.data);
        if (d.id === cur) { ws.removeEventListener('message', h); res(d.result); }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id: cur, method: m, params: p }));
    });
    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    const sendS = (m, p = {}) => new Promise(res => {
      const cur = id++;
      const h = (e) => {
        const d = JSON.parse(e.data);
        if (d.id === cur) { ws.removeEventListener('message', h); res(d.result); }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id: cur, sessionId, method: m, params: p }));
    });
    await sendS('Page.enable');
    await sendS('Page.navigate', { url: 'http://localhost:3000' });
    await new Promise(r => setTimeout(r, 3500));
    await sendS('Runtime.evaluate', {
      expression: `(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        localStorage.setItem('socialassist-theme', 'dark');
        window.dispatchEvent(new Event('socialassist-theme-change'));
        const pre = document.getElementById('pre');
        if (pre) pre.classList.add('gone');
        document.body.classList.remove('lock');
        document.querySelector('#contact').scrollIntoView({ block: 'center', behavior: 'instant' });
      })()`
    });
    await new Promise(r => setTimeout(r, 600));
    const shot = await sendS('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:\\Users\\USER\\.gemini\\antigravity\\brain\\da496d37-3ff2-4b7f-9011-fb4d0e692a91\\sec_finalcta_dark_desktop_1440.png', Buffer.from(shot.data, 'base64'));
    console.log('Final CTA updated successfully!');
    ws.close();
    p.kill();
    process.exit(0);
  } catch (err) {
    console.error(err);
    p.kill();
    process.exit(1);
  }
}, 1200);
