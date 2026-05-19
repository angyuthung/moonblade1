const C = document.getElementById('gameCanvas');
const ctx = C.getContext('2d');
const BASE_W = 480, BASE_H = 270;
let SCALE = 1;

function resizeCanvas() {
  const scaleX = window.innerWidth / BASE_W;
  const scaleY = window.innerHeight / BASE_H;
  SCALE = Math.min(scaleX, scaleY);
  const w = Math.max(1, Math.floor(BASE_W * SCALE));
  const h = Math.max(1, Math.floor(BASE_H * SCALE));
  C.width = w;
  C.height = h;
  C.style.width = w + 'px';
  C.style.height = h + 'px';
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(SCALE, SCALE);
  ctx.imageSmoothingEnabled = false;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ── PIXEL FONT RENDERER ──────────────────────────────────────────────────────
const FONT5 = {
  A:[[1,1,0],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],B:[[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,1,0]],
  C:[[0,1,1],[1,0,0],[1,0,0],[1,0,0],[0,1,1]],D:[[1,1,0],[1,0,1],[1,0,1],[1,0,1],[1,1,0]],
  E:[[1,1,1],[1,0,0],[1,1,0],[1,0,0],[1,1,1]],F:[[1,1,1],[1,0,0],[1,1,0],[1,0,0],[1,0,0]],
  G:[[0,1,1],[1,0,0],[1,0,1],[1,0,1],[0,1,1]],H:[[1,0,1],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
  I:[[1,1,1],[0,1,0],[0,1,0],[0,1,0],[1,1,1]],J:[[0,0,1],[0,0,1],[0,0,1],[1,0,1],[0,1,1]],
  K:[[1,0,1],[1,1,0],[1,0,0],[1,1,0],[1,0,1]],L:[[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,1,1]],
  M:[[1,0,1],[1,1,1],[1,1,1],[1,0,1],[1,0,1]],N:[[1,0,1],[1,1,1],[1,1,1],[1,0,1],[1,0,1]],
  O:[[0,1,0],[1,0,1],[1,0,1],[1,0,1],[0,1,0]],P:[[1,1,0],[1,0,1],[1,1,0],[1,0,0],[1,0,0]],
  Q:[[0,1,0],[1,0,1],[1,0,1],[1,1,1],[0,1,1]],R:[[1,1,0],[1,0,1],[1,1,0],[1,1,0],[1,0,1]],
  S:[[0,1,1],[1,0,0],[0,1,0],[0,0,1],[1,1,0]],T:[[1,1,1],[0,1,0],[0,1,0],[0,1,0],[0,1,0]],
  U:[[1,0,1],[1,0,1],[1,0,1],[1,0,1],[0,1,1]],V:[[1,0,1],[1,0,1],[1,0,1],[1,0,1],[0,1,0]],
  W:[[1,0,1],[1,0,1],[1,1,1],[1,1,1],[1,0,1]],X:[[1,0,1],[1,0,1],[0,1,0],[1,0,1],[1,0,1]],
  Y:[[1,0,1],[1,0,1],[0,1,0],[0,1,0],[0,1,0]],Z:[[1,1,1],[0,0,1],[0,1,0],[1,0,0],[1,1,1]],
  '0':[[0,1,0],[1,0,1],[1,0,1],[1,0,1],[0,1,0]],'1':[[0,1,0],[1,1,0],[0,1,0],[0,1,0],[1,1,1]],
  '2':[[1,1,0],[0,0,1],[0,1,0],[1,0,0],[1,1,1]],'3':[[1,1,0],[0,0,1],[0,1,0],[0,0,1],[1,1,0]],
  '4':[[1,0,1],[1,0,1],[1,1,1],[0,0,1],[0,0,1]],'5':[[1,1,1],[1,0,0],[1,1,0],[0,0,1],[1,1,0]],
  '6':[[0,1,1],[1,0,0],[1,1,0],[1,0,1],[0,1,0]],'7':[[1,1,1],[0,0,1],[0,1,0],[0,1,0],[0,1,0]],
  '8':[[0,1,0],[1,0,1],[0,1,0],[1,0,1],[0,1,0]],'9':[[0,1,0],[1,0,1],[0,1,1],[0,0,1],[0,1,0]],
  '/':[[0,0,1],[0,0,1],[0,1,0],[1,0,0],[1,0,0]],'!':[[0,1,0],[0,1,0],[0,1,0],[0,0,0],[0,1,0]],
  '?':[[1,1,0],[0,0,1],[0,1,0],[0,0,0],[0,1,0]],'…':[[0,0,0],[0,0,0],[0,0,0],[0,0,0],[1,0,1]],
  '-':[[0,0,0],[0,0,0],[1,1,1],[0,0,0],[0,0,0]],':':[[0,0,0],[0,1,0],[0,0,0],[0,1,0],[0,0,0]],
  ' ':[[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],"'":[[0,1,0],[0,1,0],[0,0,0],[0,0,0],[0,0,0]],
  '.':[[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,1,0]],'和':[[1,1,1],[1,0,1],[1,1,1],[0,1,0],[1,0,1]],
};
const UI_FONT = '"Palatino Linotype", "Georgia", "Yu Mincho", serif';
const UI_TEXT_SIZE = 11;

function uiFontSize(scale) {
  if (scale == null) return UI_TEXT_SIZE;
  return Math.round(8 + scale * 2.2);
}

function gameText(text, x, y, color='#f0eee8', size, align='left', bold=false) {
  if (size == null) size = UI_TEXT_SIZE;
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.font = `${bold ? '600' : '500'} ${size}px ${UI_FONT}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'top';
  ctx.fillStyle = 'rgba(6,4,14,0.45)';
  ctx.fillText(text, x + 1, y + 1);
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function gameTextCenter(text, y, color='#f0eee8', size, bold=false) {
  gameText(text, BASE_W / 2, y, color, size, 'center', bold);
}

function pixelText(text, x, y, color='#f0eee8', scale) {
  gameText(text.toUpperCase(), x, y, color, uiFontSize(scale), 'left');
}
function pixelTextCenter(text, y, color='#f0eee8', scale) {
  gameTextCenter(text.toUpperCase(), y, color, uiFontSize(scale));
}

function artGrad(x, y, w, h, c0, c1, vertical=true) {
  const g = vertical
    ? ctx.createLinearGradient(x, y, x, y + h)
    : ctx.createLinearGradient(x, y, x + w, y);
  g.addColorStop(0, c0);
  g.addColorStop(1, c1);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
}

// ── PALETTE ──────────────────────────────────────────────────────────────────
const P = {
  sky1:'#0d0a1f', sky2:'#1a1035', moon:'#e8e0b0', moonGlow:'rgba(220,200,100,0.15)',
  roofDark:'#1a0f1f', roofMid:'#2d1a2e', roofLight:'#3d2a3e', roofAccent:'#5a3a5a',
  roofTile:'#7a4a6a', wallDark:'#1f1228', wallMid:'#2e1d3a', wallLight:'#3e2d4e',
  lanternOrange:'#e06020', lanternYellow:'#f0a030', lanternGlow:'rgba(220,100,30,0.3)',
  playerBody:'#c8a060', playerCloak:'#2a1a3e', playerCloak2:'#3d2a5e', playerSword:'#d0d0e0',
  playerSwordGlow:'#a0a0ff', playerEye:'#f0e0a0',
  ninjaBody:'#1a1a2a', ninjaMask:'#0a0a14', ninjaEye:'#cc2020', ninjaStar:'#808090',
  spiritPetal:'#c0a0ff', spiritGlow:'rgba(180,120,255,0.4)',
  bossBody:'#1a0a0a', bossArmor:'#2a1a1a', bossArmor2:'#3d1515', bossSword:'#8080ff',
  bossSwordGlow:'rgba(80,80,220,0.5)', bossEye:'#ff2020',
  uiBack:'rgba(0,0,0,0.7)', uiBorder:'#5a3a5a', uiEnergy:'#cc4488', uiEnergyLow:'#cc2222',
  sakura:'#ffaabb', sakura2:'#ff88aa', blood:'#cc2222', hit:'#ff8800',
  ground:'#0f0a1a', groundTop:'#2a1a3a',
  textGold:'#e0c060', textWhite:'#f0eee8', textGray:'#8a8090',
};

// ── GAME STATE ───────────────────────────────────────────────────────────────
const STATES = { TITLE:0, INTRO:1, PLAYING:2, BOSS_INTRO:3, BOSS:4, CUTSCENE:5, GAMEOVER:6, WIN:7 };
let gs = STATES.TITLE;

// ── INPUT ────────────────────────────────────────────────────────────────────
const keys = {};
const justPressed = {};
const justReleased = {};
window.addEventListener('keydown', e => {
  if (!keys[e.code]) justPressed[e.code] = true;
  keys[e.code] = true;
  e.preventDefault();
});
window.addEventListener('keyup', e => {
  keys[e.code] = false;
  justReleased[e.code] = true;
});
function clearJust() { for(let k in justPressed) delete justPressed[k]; for(let k in justReleased) delete justReleased[k]; }

// ── PARTICLE SYSTEM ──────────────────────────────────────────────────────────
let particles = [];
function spawnParticle(x,y,vx,vy,life,color,size=1,grav=0) {
  particles.push({x,y,vx,vy,life,maxLife:life,color,size,grav});
}
function updateParticles() {
  particles = particles.filter(p => { p.life--; p.x+=p.vx; p.y+=p.vy; p.vy+=p.grav; return p.life>0; });
}
function drawParticles() {
  for (let p of particles) {
    const a = p.life/p.maxLife;
    ctx.globalAlpha = a;
    ctx.fillStyle = p.color;
    ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
  }
  ctx.globalAlpha = 1;
}

// ── CAMERA ───────────────────────────────────────────────────────────────────
let camX = 0, camTargetX = 0;

// ── PLATFORMS (buildings) ─────────────────────────────────────────────────────
// Each platform: {x, y, w, h, type}
// type: 'main' = main roof, 'low' = lower building, 'ledge' = small ledge
function generateWorld() {
  const platforms = [];
  // Ground is at y=220 for the whole level (invisible, used as kill zone)
  // Buildings: alternating heights, realistic Japanese rooftops
  const ROOF_HEIGHT = 12;
  let bx = 0;
  const pattern = [
    {w:90, roofY:92, h:130},{w:20, roofY:999},{w:80, roofY:98, h:120},
    {w:15, roofY:999},{w:100, roofY:88, h:135},{w:18, roofY:999},
    {w:75, roofY:102, h:115},{w:22, roofY:999},{w:95, roofY:94, h:125},
    {w:20, roofY:999},{w:85, roofY:96, h:120},{w:16, roofY:999},
    {w:110, roofY:86, h:140},{w:20, roofY:999},{w:70, roofY:104, h:110},
    {w:18, roofY:999},{w:90, roofY:92, h:128},{w:22, roofY:999},
    {w:80, roofY:98, h:118},{w:20, roofY:999},{w:100, roofY:90, h:132},
    {w:15, roofY:999},{w:75, roofY:100, h:112},{w:20, roofY:999},
    {w:200, roofY:86, h:140, isBoss:true},
  ];
  for (let seg of pattern) {
    if (seg.roofY < 300) {
      platforms.push({x:bx, y:seg.roofY, w:seg.w, h:ROOF_HEIGHT, wallH:seg.h, type:'roof', isBoss:!!seg.isBoss});
      // Maybe a small ledge on some buildings
      if (seg.w > 80 && Math.random() > 0.6) {
        platforms.push({x:bx+10+Math.floor(Math.random()*(seg.w-40)), y:seg.roofY-28, w:30, h:6, type:'ledge'});
      }
    }
    bx += seg.w;
  }
  return { platforms, totalWidth: bx };
}

const world = generateWorld();
const { platforms, totalWidth } = world;
const GROUND_Y = 260; // kill zone

function getPlatformAt(px, pw, py, tolerance=4) {
  for (let p of platforms) {
    if (px + pw > p.x && px < p.x + p.w) {
      if (py + tolerance >= p.y && py <= p.y + 8) return p;
    }
  }
  return null;
}

// ── PLAYER ───────────────────────────────────────────────────────────────────
const PLAYER_W = 10, PLAYER_H = 18;
const KATANA_REACH = 32;
const KATANA_HIT_H = 14;
let player = {
  x: 40, y: 100, vx: 0, vy: 0, w: PLAYER_W, h: PLAYER_H,
  onGround: false, facingRight: true,
  energy: 5, maxEnergy: 5,
  attacking: false, attackTimer: 0, attackCooldown: 0,
  attackHitBoss: false, attackHitIds: null, attackDir: 'right',
  hitTimer: 0, invincible: 0,
  dead: false, deathTimer: 0,
  runFrame: 0, runTimer: 0,
  jumpBuffer: 0, coyoteTime: 0,
  score: 0,
};
let playerFrozen = false;
let bossDefeatTimer = 0;
let sceneSnapshot = null;

function getPlayerSpawn() {
  const roof = platforms.find(p => p.type === 'roof');
  if (!roof) return { x: 40, y: 100 };
  return { x: roof.x + 24, y: roof.y - PLAYER_H };
}

function resetPlayer(x, y) {
  if (x === undefined || y === undefined) {
    const spawn = getPlayerSpawn();
    x = spawn.x;
    y = spawn.y;
  }
  player.x=x; player.y=y; player.vx=0; player.vy=0;
  player.w=PLAYER_W; player.h=PLAYER_H;
  player.onGround=true; player.facingRight=true;
  player.energy=5; player.maxEnergy=5;
  player.attacking=false; player.attackTimer=0; player.attackCooldown=0;
  player.hitTimer=0; player.invincible=0; player.dead=false; player.deathTimer=0;
  player.runFrame=0; player.runTimer=0; player.jumpBuffer=0; player.coyoteTime=0;
  player.attackHitBoss=false; player.attackHitIds=null;
}

function saveSceneSnapshot() {
  sceneSnapshot = { playerX: player.x, playerY: player.y, camX: camX };
}

const ATTACK_VEC = {
  tr: [1, -1], tl: [-1, -1], br: [1, 1], bl: [-1, 1],
  right: [1, 0], left: [-1, 0],
};

function getAttackDirection() {
  const up = keys['ArrowUp'] || keys['KeyW'];
  const down = keys['ArrowDown'] || keys['KeyS'];
  const left = keys['ArrowLeft'] || keys['KeyA'];
  const right = keys['ArrowRight'] || keys['KeyD'];
  if (up && right) return 'tr';
  if (up && left) return 'tl';
  if (down && right) return 'br';
  if (down && left) return 'bl';
  if (up) return player.facingRight ? 'tr' : 'tl';
  if (down) return player.facingRight ? 'br' : 'bl';
  if (right) return 'right';
  if (left) return 'left';
  return player.facingRight ? 'right' : 'left';
}

function getKatanaHitbox() {
  const dir = player.attackDir || (player.facingRight ? 'right' : 'left');
  const v = ATTACK_VEC[dir];
  const cx = player.x + PLAYER_W / 2;
  const cy = player.y + PLAYER_H / 2 + 1;
  const len = Math.hypot(v[0], v[1]);
  const ux = v[0] / len;
  const uy = v[1] / len;
  const endX = cx + ux * KATANA_REACH;
  const endY = cy + uy * KATANA_REACH;
  const pad = 12;
  const thick = 10;
  return {
    atkX: Math.min(cx, endX) - pad - thick,
    atkY: Math.min(cy, endY) - pad - thick,
    atkW: Math.abs(endX - cx) + pad * 2 + thick * 2,
    atkH: Math.abs(endY - cy) + pad * 2 + thick * 2,
    dir,
  };
}

function slashHitsTarget(target, dir) {
  const v = ATTACK_VEC[dir] || ATTACK_VEC.right;
  const cx = player.x + PLAYER_W / 2;
  const cy = player.y + PLAYER_H / 2 + 2;
  const len = Math.hypot(v[0], v[1]);
  const ux = v[0] / len;
  const uy = v[1] / len;
  const hitR = target.w >= 18 ? 18 : 12;
  for (let t = 0.25; t <= 1; t += 0.1) {
    const px = cx + ux * KATANA_REACH * t;
    const py = cy + uy * KATANA_REACH * t;
    if (px + hitR > target.x && px - hitR < target.x + target.w &&
        py + hitR > target.y && py - hitR < target.y + target.h) return true;
  }
  const hb = getKatanaHitbox();
  return hitboxOverlaps(hb.atkX, hb.atkW, hb.atkY, hb.atkH, target);
}

function hitboxOverlaps(ax, aw, ay, ah, target) {
  return target.x < ax + aw && target.x + target.w > ax &&
         target.y < ay + ah && target.y + target.h > ay;
}

// ── ENEMIES ──────────────────────────────────────────────────────────────────
let enemies = [];
let shurikens = [];
let petals = [];
let medicinePills = [];
let healPopups = [];

function spawnNinja(x, roofY) {
  return {
    x, y: roofY - 20, w:10, h:16,
    vx: 0, vy: 0, hp: 3, maxHp: 3,
    facingRight: false, state: 'patrol',
    patrolTimer: 0, patrolDir: -1,
    throwTimer: Math.floor(50+Math.random()*80),
    hitFlash: 0, dead: false, deathTimer: 0,
    roofY,
  };
}

function clampFloatItemToView(item) {
  const w = item.w || 8;
  const h = item.h || 5;
  const b = getPillViewBounds();
  if (item.x < b.minX) { item.x = b.minX; item.vx = Math.abs(item.vx) + 0.2; }
  if (item.x + w > b.maxX) { item.x = b.maxX - w; item.vx = -Math.abs(item.vx) - 0.2; }
  if (item.y < b.minY) { item.y = b.minY; item.vy = Math.abs(item.vy) + 0.2; }
  if (item.y + h > b.maxY) { item.y = b.maxY - h; item.vy = -Math.abs(item.vy) - 0.2; }
}

function spawnSpiritPetal(x, y, burstVx, burstVy) {
  const b = getPillViewBounds();
  const px = Math.max(b.minX, Math.min(b.maxX - 7, x - 3));
  const py = Math.max(b.minY + 10, Math.min(b.maxY - 7, y - 3));
  petals.push({
    x: px, y: py, w: 7, h: 7,
    vx: burstVx != null ? burstVx : (Math.random() - 0.5) * 0.9,
    vy: burstVy != null ? burstVy : (Math.random() - 0.5) * 0.9,
    collected: false,
    bob: Math.random() * Math.PI * 2,
    floatPhase: Math.random() * Math.PI * 2,
    driftTimer: Math.floor(Math.random() * 40),
  });
}

function healPlayer(amount) {
  if (player.energy >= player.maxEnergy) return false;
  player.energy = Math.min(player.maxEnergy, player.energy + amount);
  spawnHealPopup(player.x + PLAYER_W / 2, player.y - 4);
  return true;
}

function findRoofSurfaceY(x, yHint) {
  let best = null;
  for (let p of platforms) {
    if (p.type === 'ledge') continue;
    if (x >= p.x && x <= p.x + p.w && p.y >= yHint - 24 && p.y <= yHint + 20) {
      if (!best || p.y < best) best = p.y;
    }
  }
  return best;
}

function getPillViewBounds() {
  return {
    minX: camX + 6,
    maxX: camX + BASE_W - 14,
    minY: 20,
    maxY: BASE_H - 14,
  };
}

function clampPillToView(pill) { clampFloatItemToView(pill); }

function spawnMedicinePill(x, y, burstVx, burstVy) {
  const b = getPillViewBounds();
  const px = Math.max(b.minX, Math.min(b.maxX - 8, x - 4));
  const py = Math.max(b.minY, Math.min(b.maxY - 5, y - 3));
  medicinePills.push({
    x: px, y: py, w: 8, h: 5,
    vx: burstVx != null ? burstVx : (Math.random() - 0.5) * 1.4,
    vy: burstVy != null ? burstVy : -1.2 - Math.random() * 1.2,
    collected: false,
    bob: Math.random() * Math.PI * 2,
    floatPhase: Math.random() * Math.PI * 2,
    driftTimer: Math.floor(Math.random() * 40),
  });
}

function spawnBossHitPill() {
  if (!boss) return;
  const cx = boss.x + boss.w / 2;
  const cy = boss.y + boss.h / 2;
  const angle = Math.random() * Math.PI * 2;
  const spd = 1.5 + Math.random() * 1.5;
  spawnMedicinePill(
    cx, cy,
    Math.cos(angle) * spd,
    Math.sin(angle) * spd - 1.5
  );
}

function spawnHealPopup(x, y) {
  healPopups.push({ x, y, life: 45, vy: -0.35 });
}

function killEnemy(e) {
  if (e.dead) return;
  e.dead = true;
  e.deathTimer = 30;
  player.score += 100;
  const cx = e.x + e.w / 2;
  const cy = e.y + e.h / 2;
  spawnMedicinePill(cx, cy, (Math.random() - 0.5) * 1.8, -1.5 - Math.random());
  if (Math.random() > 0.45) {
    spawnMedicinePill(cx, cy, (Math.random() - 0.5) * 2, -0.8 - Math.random() * 1.5);
  }
  for (let i = 0; i < 6; i++) {
    spawnParticle(cx - camX, cy, (Math.random() - 0.5) * 2, -Math.random() * 2, 14, '#cc3344', 2, 0.06);
  }
}

function spawnShurikens() {
  // Called when a ninja throws
}

// ── BOSS ──────────────────────────────────────────────────────────────────────
let boss = null;
let bossPhase = 0;
let bossHP = 15;
const BOSS_MAX_HP = 15;
const BOSS_ATTACK_POWER = 2;
let bossShurikens = [];
let bossPatternTimer = 0;
let bossActionTimer = 0;
let bossAction = 'idle';
let bossKurohane = [];
let moonbladeVulnerable = false;
let moonbladeFlash = 0;
let bossDefeated = false;
let moonbladeBroken = false;

function initBoss() {
  const bossPlat = platforms.find(p=>p.isBoss);
  if(!bossPlat) return;
  boss = {
    x: bossPlat.x + bossPlat.w/2 - 10,
    y: bossPlat.y - 32, w:20, h:28,
    vx:0, vy:0, facingRight:false,
    hitFlash:0, dead:false,
    floorY: bossPlat.y,
    arenaX: bossPlat.x, arenaW: bossPlat.w,
  };
  bossHP = BOSS_MAX_HP;
  bossPhase = 1;
  bossActionTimer = 60;
  bossAction = 'idle';
  bossShurikens = [];
  bossKurohane = [];
  moonbladeVulnerable = false;
}

// ── WORLD GENERATION: ENEMIES ─────────────────────────────────────────────────
function populateEnemies() {
  enemies = [];
  let placed = 0;
  for (let i=0; i<platforms.length-1; i++) {
    const p = platforms[i];
    if (p.type !== 'roof' || p.isBoss) continue;
    if (p.w < 60) continue;
    if (placed < 3 || Math.random() > 0.4) {
      if (p.x > 150) {
        enemies.push(spawnNinja(p.x + p.w/2 - 5, p.y));
        placed++;
      }
    }
  }
  petals = [];
  for (let i = 0; i < 8; i++) {
    spawnSpiritPetal(60 + Math.random() * 200, 35 + Math.random() * 55);
  }
  for (let i = 0; i < platforms.length - 1; i++) {
    const p = platforms[i];
    if (p.type !== 'roof' || p.isBoss || p.x > 500) continue;
    if (Math.random() > 0.5) {
      spawnSpiritPetal(
        p.x + 15 + Math.random() * (p.w - 30),
        p.y - 18 + Math.random() * 8,
        (Math.random() - 0.5) * 0.7,
        (Math.random() - 0.5) * 0.5
      );
    }
  }
}

populateEnemies();

// ── BACKGROUND ELEMENTS ───────────────────────────────────────────────────────
let worldT = 0;

const stars = Array.from({length:80}, ()=>({
  x: Math.random()*totalWidth*0.3 + Math.random()*totalWidth*0.7,
  y: Math.random()*80,
  br: Math.random()>0.7,
  t: Math.random()*60,
  drift: (Math.random()-0.5)*0.04,
}));

const lanterns = [];
for (let p of platforms) {
  if (p.type === 'roof' && p.w > 60) {
    lanterns.push({x: p.x+12, y: p.y-8, phase: Math.random()*Math.PI*2, glow: Math.random()});
    if (p.w > 85) lanterns.push({x: p.x+p.w-18, y: p.y-8, phase: Math.random()*Math.PI*2, glow: Math.random()});
  }
}

const ambientSakura = Array.from({length:18}, (_, i) => ({
  x: Math.random() * totalWidth,
  y: 8 + Math.random() * 70,
  vx: 0.12 + Math.random() * 0.2,
  vy: 0.04 + Math.random() * 0.08,
  phase: Math.random() * Math.PI * 2,
}));

function updateFloatItem(item) {
  if (item.collected) return;
  item.floatPhase += 0.06;
  item.driftTimer--;
  if (item.driftTimer <= 0) {
    item.driftTimer = 28 + Math.floor(Math.random() * 36);
    item.vx += (Math.random() - 0.5) * 0.75;
    item.vy += (Math.random() - 0.5) * 0.75;
  }
  item.vx += Math.sin(item.floatPhase) * 0.035;
  item.vy += Math.cos(item.floatPhase * 1.35) * 0.035;
  const maxSpd = 1.15;
  item.vx = Math.max(-maxSpd, Math.min(maxSpd, item.vx * 0.985));
  item.vy = Math.max(-maxSpd, Math.min(maxSpd, item.vy * 0.985));
  item.x += item.vx;
  item.y += item.vy;
  clampFloatItemToView(item);
}

function updatePetals() {
  for (let p of petals) updateFloatItem(p);
  petals = petals.filter(p => !p.collected);
}

function updateWorldAmbient() {
  worldT++;
  for (let s of stars) {
    s.t += 0.03;
    s.x += s.drift;
    s.y += Math.sin(worldT * 0.015 + s.t) * 0.025;
    if (s.x < 0) s.x += totalWidth;
    if (s.x > totalWidth) s.x -= totalWidth;
    if (s.y < 2) s.y = 78;
    if (s.y > 82) s.y = 4;
  }
  for (let l of lanterns) {
    l.phase += 0.035 + l.glow * 0.01;
    l.glowPhase = (l.glowPhase || 0) + 0.05;
  }
  for (let a of ambientSakura) {
    a.x += a.vx;
    a.y += a.vy + Math.sin(worldT * 0.02 + a.phase) * 0.12;
    if (a.x > totalWidth + 20) a.x = -10;
    if (a.x < -20) a.x = totalWidth + 10;
    if (a.y > 85) { a.y = 5; a.x = camX + Math.random() * BASE_W; }
  }
}

function drawAmbientSakura() {
  for (let a of ambientSakura) {
    const sx = Math.floor(a.x - camX);
    const sy = Math.floor(a.y + Math.sin(worldT * 0.03 + a.phase));
    if (sx < -8 || sx > BASE_W + 8) continue;
    ctx.globalAlpha = 0.45 + Math.sin(a.phase + worldT * 0.04) * 0.2;
    ctx.fillStyle = P.sakura;
    ctx.fillRect(sx, sy, 2, 2);
    ctx.fillRect(sx + 1, sy - 1, 1, 1);
    ctx.globalAlpha = 1;
  }
}

// ── DRAWING FUNCTIONS ─────────────────────────────────────────────────────────
function drawBackground() {
  const skyColors = ['#0d0a1f','#0f0c24','#120e28','#15112c','#181330','#1b1534'];
  const bandH = Math.ceil(BASE_H/skyColors.length);
  for (let i=0;i<skyColors.length;i++) {
    ctx.fillStyle = skyColors[i];
    ctx.fillRect(0, i*bandH, BASE_W, bandH+1);
  }

  const moonX = 400 - camX * 0.02 + Math.sin(worldT * 0.008) * 3;
  const moonY = 40 + Math.sin(worldT * 0.01) * 2;
  ctx.fillStyle = P.moonGlow;
  ctx.beginPath(); ctx.arc(moonX, moonY, 22, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = P.moon;
  for(let my=moonY-14;my<=moonY+14;my+=1) {
    const hw = Math.round(Math.sqrt(14*14-(my-moonY)*(my-moonY)));
    ctx.fillRect(moonX-hw, my, hw*2, 1);
  }
  // Kanji on moon
  ctx.globalAlpha=0.3;
  pixelText('和', moonX-6, moonY-7, '#a09060', 2);
  ctx.globalAlpha=1;
}

function drawStars(t) {
  for (let s of stars) {
    const sx = ((s.x - camX * 0.05 + Math.sin(t * 0.012 + s.t) * 3) % BASE_W + BASE_W) % BASE_W;
    const sy = s.y + Math.sin(t * 0.018 + s.t * 1.3) * 1.2;
    const br = s.br ? (Math.sin(t * 0.05 + s.t) * 0.5 + 0.5) : 0.55 + Math.sin(t * 0.03 + s.t) * 0.15;
    ctx.globalAlpha = 0.25 + br * 0.55;
    ctx.fillStyle = '#e8e0c0';
    ctx.fillRect(Math.floor(sx), Math.floor(sy), 1, 1);
    if (s.br && br > 0.75) {
      ctx.globalAlpha = 0.15;
      ctx.fillRect(Math.floor(sx), Math.floor(sy), 2, 1);
    }
  }
  ctx.globalAlpha = 1;
}

function drawBuilding(p, cx, t) {
  const wx = p.x - cx;
  if (wx + p.w < -20 || wx > BASE_W+20) return;

  if (p.type === 'ledge') {
    ctx.fillStyle = P.roofMid;
    ctx.fillRect(wx, p.y, p.w, p.h);
    ctx.fillStyle = P.roofAccent;
    ctx.fillRect(wx, p.y, p.w, 2);
    return;
  }

  // Wall
  const wallH = p.wallH || 120;
  ctx.fillStyle = P.wallDark;
  ctx.fillRect(wx, p.y+p.h, p.w, wallH);
  ctx.fillStyle = P.wallMid;
  ctx.fillRect(wx+2, p.y+p.h, p.w-4, wallH-2);

  // Windows (evenly spaced)
  ctx.fillStyle = '#0a0814';
  const winW=10, winH=12, winSpacing=22;
  let wx2 = wx+10;
  while (wx2+winW < wx+p.w-6) {
    ctx.fillStyle = '#0a0814';
    ctx.fillRect(wx2, p.y+p.h+10, winW, winH);
    const flicker = Math.sin(t * 0.04 + wx2 * 0.2 + p.x * 0.01) * 0.5 + 0.5;
    const baseLit = (wx2 + p.x) % 37 < 18;
    if (baseLit || flicker > 0.72) {
      ctx.fillStyle = `rgba(200,150,60,${0.1 + flicker * 0.2})`;
      ctx.fillRect(wx2, p.y+p.h+10, winW, winH);
    }
    wx2 += winSpacing;
  }

  // Roof base
  ctx.fillStyle = P.roofDark;
  ctx.fillRect(wx, p.y, p.w, p.h);

  // Curved roof shape (pixelated eave)
  const eaveDepth = 4;
  ctx.fillStyle = P.roofMid;
  ctx.fillRect(wx-eaveDepth, p.y, p.w+eaveDepth*2, 4);
  ctx.fillStyle = P.roofLight;
  ctx.fillRect(wx-eaveDepth, p.y, p.w+eaveDepth*2, 2);
  ctx.fillStyle = P.roofAccent;
  ctx.fillRect(wx-eaveDepth, p.y, p.w+eaveDepth*2, 1);

  // Roof ridge tiles
  ctx.fillStyle = P.roofTile;
  for (let tx=wx; tx<wx+p.w; tx+=6) {
    ctx.fillRect(tx, p.y, 4, 2);
  }

  // Top finial/ornament
  ctx.fillStyle = P.roofAccent;
  ctx.fillRect(wx+Math.floor(p.w/2)-2, p.y-4, 4, 4);
  ctx.fillStyle = P.roofLight;
  ctx.fillRect(wx+Math.floor(p.w/2)-1, p.y-6, 2, 2);

  // Boss shrine: extra decoration
  if (p.isBoss) {
    ctx.fillStyle = '#6a2a2a';
    ctx.fillRect(wx+p.w/2-15, p.y-12, 30, 12);
    ctx.fillStyle = '#8a3a3a';
    ctx.fillRect(wx+p.w/2-14, p.y-11, 28, 1);
    pixelText('和', wx+p.w/2-7, p.y-10, '#c06020', 2);
  }
}

function drawLantern(l, t) {
  const sx = l.x - camX;
  if (sx < -10 || sx > BASE_W+10) return;
  const swing = Math.sin(l.phase + t * 0.02) * 2.5;
  const glowA = 0.2 + Math.sin((l.glowPhase || 0) + t * 0.04) * 0.12;
  ctx.fillStyle = '#5a3a3a';
  ctx.fillRect(sx+3, l.y-8+swing, 1, 8);
  ctx.fillStyle = `rgba(220,100,30,${glowA})`;
  ctx.beginPath(); ctx.arc(sx+3, l.y+4+swing, 8 + Math.sin(l.phase)*1.5, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = P.lanternOrange;
  ctx.fillRect(sx, l.y+swing, 7, 10);
  ctx.fillStyle = P.lanternYellow;
  ctx.fillRect(sx+1, l.y+1+swing, 5, 4);
  ctx.fillStyle = '#c04010';
  ctx.fillRect(sx, l.y+swing, 7, 2);
  ctx.fillRect(sx, l.y+8+swing, 7, 2);
}

function drawKatanaSheathed() {
  artGrad(6, 9, 9, 3, '#5a4030', '#3a2818', false);
  ctx.fillStyle = '#c8a050';
  ctx.fillRect(10, 8, 2, 4);
  artGrad(11, 4, 2, 10, '#c8c8e0', '#9090b8', true);
}

function drawKatanaSlash(localDir) {
  const v = ATTACK_VEC[localDir] || ATTACK_VEC.right;
  const angle = Math.atan2(v[1], v[0]);
  ctx.save();
  ctx.translate(PLAYER_W / 2, PLAYER_H / 2 - 1);
  ctx.rotate(angle);
  artGrad(2, -2, KATANA_REACH - 4, 4, 'rgba(180,180,255,0.55)', 'rgba(120,120,200,0.15)', false);
  artGrad(4, -1, KATANA_REACH - 8, 2, '#e8e8ff', '#a8a8d0', false);
  ctx.fillStyle = '#f8f8ff';
  ctx.fillRect(KATANA_REACH - 10, -1, 6, 1);
  artGrad(-2, 0, 6, 3, '#5a4030', '#2a1810', false);
  ctx.fillStyle = '#c8a050';
  ctx.fillRect(-1, -2, 2, 4);
  ctx.restore();
}

function worldToLocalAttackDir(worldDir, facingRight) {
  if (facingRight) return worldDir;
  const flip = { tr: 'tl', tl: 'tr', br: 'bl', bl: 'br', right: 'left', left: 'right' };
  return flip[worldDir] || worldDir;
}

function drawSlashEffect(sx, sy, worldDir, t) {
  const v = ATTACK_VEC[worldDir] || ATTACK_VEC.right;
  const cx = sx + PLAYER_W / 2;
  const cy = sy + PLAYER_H / 2;
  const len = KATANA_REACH * 0.9;
  const ex = cx + v[0] * len / Math.max(1, Math.hypot(v[0], v[1]));
  const ey = cy + v[1] * len / Math.max(1, Math.hypot(v[0], v[1]));
  ctx.save();
  ctx.strokeStyle = `rgba(200,200,255,${0.35 + (player.attackTimer % 4) * 0.05})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(ex, ey);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

function drawHumanLeg(hipX, hipY, kneeX, kneeY, footX, footY) {
  ctx.fillStyle = '#2a1a38';
  ctx.fillRect(hipX, hipY, 2, kneeY - hipY + 1);
  ctx.fillRect(kneeX, kneeY, 2, footY - kneeY);
  ctx.fillStyle = '#1a1018';
  ctx.fillRect(footX - 1, footY, 3, 2);
  ctx.fillStyle = '#3a3028';
  ctx.fillRect(footX, footY - 1, 2, 1);
}

function drawPlayerLegs(walking) {
  const hipY = 10;
  if (!walking) {
    drawHumanLeg(3, hipY, 3, 14, 3, 17);
    drawHumanLeg(6, hipY, 6, 14, 6, 17);
    return;
  }
  const cycle = [
    { l: [3, hipY, 2, 13, 2, 17], r: [6, hipY, 7, 11, 8, 14] },
    { l: [3, hipY, 3, 12, 4, 15], r: [6, hipY, 6, 12, 6, 15] },
    { l: [3, hipY, 4, 11, 5, 14], r: [6, hipY, 6, 13, 7, 17] },
    { l: [3, hipY, 3, 12, 3, 15], r: [6, hipY, 5, 13, 5, 17] },
    { l: [3, hipY, 2, 11, 2, 14], r: [6, hipY, 6, 13, 7, 17] },
    { l: [3, hipY, 3, 12, 4, 15], r: [6, hipY, 5, 12, 4, 17] },
  ];
  const pose = cycle[player.runFrame % cycle.length];
  drawHumanLeg(...pose.l);
  drawHumanLeg(...pose.r);
}

// ── DRAW PLAYER ───────────────────────────────────────────────────────────────
function drawPlayer(t) {
  const sx = Math.floor(player.x - camX), sy = Math.floor(player.y);
  if (player.dead) {
    ctx.globalAlpha = Math.max(0, player.deathTimer/60);
    ctx.fillStyle = P.playerCloak;
    ctx.fillRect(sx, sy+8, PLAYER_W, PLAYER_H-8);
    ctx.globalAlpha=1;
    return;
  }
  const flash = player.invincible > 0 && Math.floor(t*0.5)%2===0;
  if (flash) return;

  const dir = player.facingRight ? 1 : -1;
  const ox = player.facingRight ? 0 : PLAYER_W;
  const walking = player.onGround && Math.abs(player.vx) > 0.05;

  ctx.save();
  ctx.translate(sx + ox, sy);
  ctx.scale(dir, 1);

  drawPlayerLegs(walking);

  artGrad(0, 5, PLAYER_W, 12, '#3d2a5e', '#221430', true);
  artGrad(1, 6, 8, 10, '#4a3568', '#2a1a3e', true);
  ctx.fillStyle = 'rgba(200,150,80,0.35)';
  ctx.fillRect(2, 8, 6, 1);
  ctx.fillStyle = '#8a6040';
  ctx.fillRect(3, 9, 4, 2);

  artGrad(2, 0, 7, 7, '#d8b878', '#a88850', true);
  ctx.fillStyle = '#1a1008';
  ctx.fillRect(4, -2, 3, 3);
  ctx.fillRect(3, 1, 5, 2);
  ctx.fillStyle = P.playerEye;
  ctx.fillRect(5, 2, 2, 1);
  ctx.fillStyle = '#2a1810';
  ctx.fillRect(6, 2, 1, 1);

  const katanaOut = player.attacking && player.attackTimer > 6;
  const worldDir = player.attackDir || (player.facingRight ? 'right' : 'left');
  if (katanaOut) drawKatanaSlash(worldToLocalAttackDir(worldDir, player.facingRight));
  else drawKatanaSheathed();

  ctx.restore();

  if (katanaOut) drawSlashEffect(sx, sy, worldDir, t);

  // Hit effect
  if (player.hitTimer > 0) {
    ctx.globalAlpha = player.hitTimer/10 * 0.5;
    ctx.fillStyle = P.hit;
    ctx.fillRect(sx, sy, PLAYER_W, PLAYER_H);
    ctx.globalAlpha = 1;
  }
}

// ── DRAW NINJA ────────────────────────────────────────────────────────────────
function drawNinja(e) {
  const bob = e.dead ? 0 : Math.sin(worldT * 0.06 + e.x * 0.05) * 0.6;
  const sx = Math.floor(e.x - camX), sy = Math.floor(e.y + bob);
  if (sx < -20 || sx > BASE_W+20) return;
  if (e.dead) {
    if (e.deathTimer > 0) {
      ctx.globalAlpha = e.deathTimer/30;
      ctx.fillStyle = P.ninjaBody;
      ctx.fillRect(sx, sy+6, e.w, e.h-6);
      ctx.globalAlpha=1;
    }
    return;
  }
  const flash = e.hitFlash > 0;

  const dir = e.facingRight ? 1 : -1;
  const ox = e.facingRight ? 0 : e.w;

  ctx.save();
  ctx.translate(sx+ox, sy);
  ctx.scale(dir, 1);

  if (flash) {
    ctx.fillStyle = 'rgba(255,120,40,0.85)';
    ctx.fillRect(0, 0, e.w, e.h);
  } else {
    artGrad(1, 11, 3, 5, '#1e1e30', '#0c0c18', true);
    artGrad(6, 11, 3, 5, '#1e1e30', '#0c0c18', true);
    artGrad(0, 5, e.w, 10, '#2a2a42', '#141422', true);
    artGrad(1, 6, e.w - 2, 3, '#3a2848', '#1a1028', false);
    ctx.fillStyle = '#120818';
    ctx.fillRect(0, 8, e.w, 1);
    artGrad(1, 0, 8, 7, '#24243a', '#12121e', true);
    artGrad(1, 2, 8, 5, '#0e0e18', '#06060e', true);
    ctx.fillStyle = P.ninjaEye;
    ctx.fillRect(5, 3, 3, 1);
    ctx.fillStyle = 'rgba(200,40,40,0.6)';
    ctx.fillRect(5, 3, 2, 1);
    ctx.fillStyle = '#707088';
    ctx.fillRect(7, 9, 3, 3);
    ctx.fillStyle = '#9090a8';
    ctx.fillRect(8, 10, 1, 1);
  }

  ctx.restore();

  // HP bar
  if (e.hp < e.maxHp) {
    ctx.fillStyle = '#1a0a0a';
    ctx.fillRect(sx, sy-4, e.w, 2);
    ctx.fillStyle = '#cc2244';
    ctx.fillRect(sx, sy-4, Math.floor(e.w * e.hp/e.maxHp), 2);
  }
}

function drawShuriken(s) {
  const sx = Math.floor(s.x - camX), sy = Math.floor(s.y);
  if (sx < -10 || sx > BASE_W+10) return;
  const r = s.rot;
  ctx.save();
  ctx.translate(sx+3, sy+3);
  ctx.rotate(r);
  ctx.fillStyle = P.ninjaStar;
  ctx.fillRect(-4, -1, 8, 2);
  ctx.fillRect(-1, -4, 2, 8);
  ctx.fillStyle = '#b0b0c0';
  ctx.fillRect(-3, -1, 2, 2);
  ctx.fillRect(1, -1, 2, 2);
  ctx.restore();
}

function drawMedicinePill(pill, t) {
  if (pill.collected) return;
  const bob = Math.sin(t * 0.08 + pill.bob) * 1.5;
  const sx = Math.floor(pill.x - camX);
  const sy = Math.floor(pill.y + bob);
  if (sx < -12 || sx > BASE_W + 12) return;
  ctx.fillStyle = 'rgba(220,60,60,0.25)';
  ctx.beginPath();
  ctx.ellipse(sx + 4, sy + 4, 6, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(sx + 1, sy + 1, 6, 4);
  ctx.fillStyle = '#d03030';
  ctx.fillRect(sx + 1, sy + 3, 6, 2);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(sx + 2, sy + 2, 4, 1);
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillRect(sx + 2, sy + 1, 2, 1);
}

function updateMedicinePills() {
  for (let pill of medicinePills) updateFloatItem(pill);
  medicinePills = medicinePills.filter(p => !p.collected);
}

function updateHealPopups() {
  healPopups = healPopups.filter(h => {
    h.life--;
    h.y += h.vy;
    return h.life > 0;
  });
}

function drawHealPopups() {
  for (let h of healPopups) {
    const sx = Math.floor(h.x - camX);
    const a = h.life / 45;
    ctx.globalAlpha = a;
    gameText('+1 HP', sx, h.y, '#88ffaa', 10, 'center');
    ctx.globalAlpha = 1;
  }
}

function collectHealthPickups() {
  const tryCollect = (item, particleColor) => {
    if (item.collected) return;
    const w = item.w || 8;
    const h = item.h || 5;
    if (player.x < item.x + w && player.x + PLAYER_W > item.x &&
        player.y < item.y + h && player.y + PLAYER_H > item.y) {
      item.collected = true;
      if (healPlayer(1)) {
        for (let i = 0; i < 6; i++) {
          spawnParticle(item.x - camX, item.y, (Math.random() - 0.5) * 2, -1 - Math.random(), 16, particleColor, 2, 0.04);
        }
      }
    }
  };
  for (let pill of medicinePills) tryCollect(pill, '#88ffaa');
  for (let p of petals) {
    tryCollect(p, P.spiritPetal);
    if (p.collected) player.score += 25;
  }
}

function drawPetal(p, t) {
  if (p.collected) return;
  const bob = Math.sin((t || worldT) * 0.09 + (p.bob || 0)) * 1.5;
  const sx = Math.floor(p.x - camX);
  const sy = Math.floor(p.y + bob);
  if (sx < -12 || sx > BASE_W + 12) return;
  ctx.fillStyle = P.spiritGlow;
  ctx.beginPath();
  ctx.arc(sx + 3, sy + 3, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = P.spiritPetal;
  ctx.fillRect(sx, sy, 2, 4);
  ctx.fillRect(sx + 2, sy - 1, 2, 2);
  ctx.fillRect(sx + 2, sy + 3, 2, 2);
  ctx.fillRect(sx + 4, sy, 2, 4);
  ctx.fillStyle = 'rgba(255,220,240,0.7)';
  ctx.fillRect(sx + 2, sy + 1, 2, 1);
}

// ── DRAW BOSS ─────────────────────────────────────────────────────────────────
function drawBoss(t) {
  if (!boss) return;
  const sx = Math.floor(boss.x - camX), sy = Math.floor(boss.y);

  const flash = boss.hitFlash > 0;
  const dir = boss.facingRight ? 1 : -1;
  const ox = boss.facingRight ? 0 : boss.w;

  ctx.save();
  ctx.translate(sx+ox, sy);
  ctx.scale(dir, 1);

  if (flash) {
    ctx.fillStyle = 'rgba(255,60,40,0.9)';
    ctx.fillRect(0, 0, boss.w, boss.h);
  } else {
    artGrad(2, 20, 6, 8, '#4a2828', '#2a1414', true);
    artGrad(12, 20, 6, 8, '#4a2828', '#2a1414', true);
    artGrad(0, 8, boss.w, 16, '#5a2020', '#2a0c0c', true);
    artGrad(2, 9, 16, 12, '#6a3030', '#3a1818', true);
    ctx.fillStyle = 'rgba(40,20,20,0.8)';
    ctx.fillRect(3, 14, 14, 2);
    artGrad(-4, 8, 6, 9, '#4a1818', '#2a0808', true);
    artGrad(boss.w - 2, 8, 6, 9, '#4a1818', '#2a0808', true);
    artGrad(2, 0, 16, 10, '#1a0808', '#0a0404', true);
    ctx.fillStyle = P.bossEye;
    ctx.fillRect(5, 3, 3, 2);
    ctx.fillRect(12, 3, 3, 2);
    ctx.fillStyle = 'rgba(255,80,60,0.5)';
    ctx.fillRect(5, 3, 2, 1);
    ctx.fillRect(12, 3, 2, 1);
    artGrad(0, -6, boss.w, 7, '#1a1428', '#0a0814', true);
    artGrad(2, -5, 16, 5, '#2a2440', '#141020', true);
    artGrad(7, -11, 6, 6, '#9090e8', '#5050a8', true);
    ctx.fillStyle = 'rgba(80,80,200,0.25)';
    ctx.fillRect(4, 2, 12, 14);

    const swingOff = bossAction === 'slash' ? 14 : 0;
    artGrad(boss.w, 6 + swingOff, 5, 18, 'rgba(120,120,255,0.5)', 'rgba(60,60,160,0.1)', true);
    artGrad(boss.w + 1, 6 + swingOff, 2, 20, '#9090e8', '#5050a0', true);
    ctx.fillStyle = '#e8e8ff';
    ctx.fillRect(boss.w + 1, 6 + swingOff, 2, 1);
    if (moonbladeFlash > 0) {
      ctx.fillStyle = `rgba(120,120,255,${moonbladeFlash / 12 * 0.45})`;
      ctx.fillRect(boss.w - 2, 4 + swingOff, 8, 24);
    }
  }

  ctx.restore();

  // Boss HP bar
  const barW = 160, barX = (BASE_W - barW)/2, barY = 12;
  ctx.fillStyle = P.uiBack;
  ctx.fillRect(barX-2, barY-2, barW+4, 10);
  ctx.fillStyle = '#3a0a0a';
  ctx.fillRect(barX, barY, barW, 6);
  const hpFrac = Math.max(0, bossHP/BOSS_MAX_HP);
  const hpColor = hpFrac > 0.5 ? '#cc2244' : hpFrac > 0.25 ? '#cc4422' : '#ff2200';
  ctx.fillStyle = hpColor;
  ctx.fillRect(barX, barY, Math.floor(barW * hpFrac), 6);
  ctx.fillStyle = P.uiBorder;
  ctx.fillRect(barX-1, barY-1, barW+2, 8);
  pixelTextCenter('LORD KUROGANE', barY-12, P.textGold, 1);
}

function drawBossShuriken(s) {
  const sx = Math.floor(s.x - camX), sy = Math.floor(s.y);
  const r = s.rot;
  ctx.save();
  ctx.translate(sx+4, sy+4);
  ctx.rotate(r);
  ctx.fillStyle = '#6060cc';
  ctx.fillRect(-5, -1, 10, 2);
  ctx.fillRect(-1, -5, 2, 10);
  ctx.fillStyle = '#9090ff';
  ctx.fillRect(-3, -1, 2, 2);
  ctx.fillRect(1, -1, 2, 2);
  ctx.restore();
}

// ── DRAW HUD ──────────────────────────────────────────────────────────────────
function drawHUD() {
  // Spirit Energy bar
  const barX = 8, barY = 8, bw = 5, bh = 16, gap = 2;
  pixelText('HP', barX, barY-12, P.textGold, 1);
  for (let i=0; i<player.maxEnergy; i++) {
    const filled = i < player.energy;
    ctx.fillStyle = filled ? (player.energy <= 1 ? P.uiEnergyLow : P.uiEnergy) : '#2a1a2a';
    ctx.fillRect(barX + i*(bw+gap), barY, bw, bh);
    ctx.fillStyle = filled ? 'rgba(255,150,200,0.3)' : 'rgba(0,0,0,0)';
    ctx.fillRect(barX + i*(bw+gap), barY, bw, 4);
    ctx.fillStyle = P.uiBorder;
    ctx.fillRect(barX + i*(bw+gap) - 1, barY-1, bw+2, bh+2);
    ctx.fillStyle = '#1a0a1a';
    ctx.fillRect(barX + i*(bw+gap), barY, bw, bh);
    if (filled) {
      ctx.fillStyle = (player.energy <= 1 ? P.uiEnergyLow : P.uiEnergy);
      ctx.fillRect(barX + i*(bw+gap), barY, bw, bh);
      ctx.fillStyle = 'rgba(255,200,220,0.4)';
      ctx.fillRect(barX + i*(bw+gap), barY, bw, 3);
    }
    ctx.strokeStyle = P.uiBorder;
    ctx.strokeRect(barX + i*(bw+gap), barY, bw, bh);
  }

  pixelText('SCORE:'+player.score, BASE_W-120, 6, P.textGold, 1);

  if (gs === STATES.BOSS && boss && !boss.dead) {
    const barW = 120, barX = BASE_W - barW - 8, barY = 22;
    ctx.fillStyle = P.uiBack;
    ctx.fillRect(barX - 2, barY - 2, barW + 4, 10);
    ctx.fillStyle = '#2a0a0a';
    ctx.fillRect(barX, barY, barW, 6);
    const hpFrac = Math.max(0, bossHP / BOSS_MAX_HP);
    ctx.fillStyle = hpFrac > 0.5 ? '#cc2244' : hpFrac > 0.25 ? '#dd4422' : '#ff3300';
    ctx.fillRect(barX, barY, Math.floor(barW * hpFrac), 6);
    pixelText('BOSS HP:' + bossHP, barX, barY - 11, P.textGold, 1);
    pixelText('ATK x' + BOSS_ATTACK_POWER, barX, barY + 10, '#aaccff', 1);
  }

  if (gs === STATES.PLAYING && player.x < 200) {
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, BASE_H-22, BASE_W, 22);
    pixelTextCenter('SLASH(X)  JUMP(Z)  PILLS/PETALS:+1 HP', BASE_H-18, P.textGray, 1);
  }
}

// ── DRAW TITLE SCREEN ─────────────────────────────────────────────────────────
let titleT = 0;
function drawTitle() {
  titleT++;
  drawBackground();
  drawStars(titleT);

  // Falling sakura petals
  for (let i=0; i<8; i++) {
    const px = ((titleT*0.7 + i*61) % BASE_W);
    const py = ((titleT*0.5 + i*47) % BASE_H);
    ctx.fillStyle = P.sakura;
    ctx.fillRect(px, py, 2, 2);
  }

  // Title text
  const fade = Math.min(1, titleT/60);
  ctx.globalAlpha = fade;
  pixelTextCenter('和', 42, P.textGold, 3);
  pixelTextCenter('WA', 72, P.textGold, 2);
  pixelTextCenter('BROKEN HARMONY', 98, P.textWhite, 1);

  const blink = Math.floor(titleT/25)%2===0;
  if (blink) pixelTextCenter('PRESS ENTER TO BEGIN', 155, P.textGold, 1);

  pixelTextCenter('ARROW KEYS / WASD : MOVE', 182, P.textGray, 1);
  pixelTextCenter('ARROWS+DIR + X : 4-WAY SLASH', 198, P.textGray, 1);

  ctx.globalAlpha = 0.4;
  pixelTextCenter('A TALE OF HAYATO THE SAMURAI', BASE_H-22, P.textGray, 2);
  ctx.globalAlpha = 1;
}

// ── INTRO SEQUENCE ────────────────────────────────────────────────────────────
let introLines = [
  'THE TOWN OF TSUKIHANA SLEEPS UNDER',
  'AN UNNATURAL CURSE...',
  '',
  'HAYATO RUNS ACROSS THE ROOFTOPS',
  'SEEKING LORD KUROGANE.',
  '',
  'AIKO\'S SPIRIT PETALS GUIDE HIS PATH.',
  '',
  'COLLECT PETALS TO RESTORE SPIRIT ENERGY.',
  'ATTACK NINJAS. DODGE SHURIKENS.',
  '',
  'PRESS ENTER TO BEGIN...',
];
let introLine = 0, introChar = 0, introTimer = 0;
function updateIntro() {
  introTimer++;
  if (introTimer % 3 === 0) {
    const line = introLines[introLine] || '';
    if (introChar < line.length) introChar++;
    else {
      if (introTimer % 60 === 0) {
        introLine++;
        introChar = 0;
        if (introLine >= introLines.length) { introLine = introLines.length-1; }
      }
    }
  }
  if (justPressed['Enter'] || justPressed['Space']) {
    gs = STATES.PLAYING;
    camX = 0;
    resetPlayer();
  }
}
function drawIntro() {
  drawBackground();
  drawStars(titleT++);
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(20, 30, BASE_W-40, BASE_H-60);
  ctx.fillStyle = P.uiBorder;
  ctx.fillRect(20, 30, BASE_W-40, 1);
  ctx.fillRect(20, BASE_H-30, BASE_W-40, 1);
  for (let i=0; i<=introLine && i<introLines.length; i++) {
    const line = i < introLine ? introLines[i] : introLines[i].substr(0, introChar);
    if (line) pixelTextCenter(line, 40 + i*13, P.textWhite, 1);
  }
}

// ── BOSS INTRO SEQUENCE ───────────────────────────────────────────────────────
let bossIntroTimer = 0;
let bossIntroLines = [
  'LORD KUROGANE APPEARS',
  '',
  'THE MOONBLADE GLEAMS...',
  'ONLY AIKO\'S SPIRIT CAN REVEAL ITS WEAKNESS.',
  '',
  'DODGE. JUMP. STRIKE.',
];
function updateBossIntro() {
  bossIntroTimer++;
  if (bossIntroTimer > 160 || justPressed['Enter'] || justPressed['Space']) {
    gs = STATES.BOSS;
    initBoss();
    playerFrozen = false;
  }
}
function drawBossIntro() {
  drawBackground();
  ctx.fillStyle = 'rgba(0,0,0,0.8)';
  ctx.fillRect(0, 0, BASE_W, BASE_H);
  ctx.fillStyle = '#3a0a0a';
  ctx.fillRect(0, BASE_H/2-30, BASE_W, 60);
  pixelTextCenter('BOSS FIGHT', BASE_H/2-28, '#ff6666', 2);
  const show = Math.min(bossIntroLines.length, Math.floor(bossIntroTimer/25));
  for (let i=0; i<show; i++) {
    pixelTextCenter(bossIntroLines[i], BASE_H/2+14 + i*13, P.textGold, 1);
  }
}

// ── GAME OVER ─────────────────────────────────────────────────────────────────
let gameOverTimer = 0;
function drawGameOver() {
  gameOverTimer++;
  drawBackground();
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0,0,BASE_W,BASE_H);
  pixelTextCenter('HAYATO FALLS', BASE_H/2-28, '#cc2222', 2);
  pixelTextCenter('SPIRIT ENERGY DEPLETED', BASE_H/2+4, P.textGold, 1);
  if (gameOverTimer > 60) pixelTextCenter('PRESS ENTER TO TRY AGAIN', BASE_H/2+28, P.textWhite, 1);
  if ((justPressed['Enter'] || justPressed['Space']) && gameOverTimer > 60) {
    restartGame();
  }
}

// ── CUTSCENE (post-boss) ──────────────────────────────────────────────────────
let cutsceneStep = 0, cutsceneTimer = 0, cutsceneText = '', cutsceneChar = 0;
const cutsceneLines = [
  {speaker:'', text:'THE SCREEN DARKENS.', delay:80},
  {speaker:'', text:'BREAK THE MOONBLADE?', delay:100, isChoice:true},
  {speaker:'', text:'[ BREAK IT ]   [ KEEP IT ]', delay:100, isChoiceOpts:true},
  {speaker:'', text:'...', delay:80},
  {speaker:'', text:'THE RAIN STOPS MOVING.', delay:80},
  {speaker:'', text:'THE PETALS FREEZE MID-AIR.', delay:80},
  {speaker:'', text:'THE MOONLIGHT HOLDS ITS BREATH.', delay:80},
  {speaker:'HAYATO:', text:'PLAYER-SAMA...', delay:100},
  {speaker:'HAYATO:', text:'THANK YOU FOR CARRYING MY FEET ACROSS THE ROOFTOPS.', delay:120},
  {speaker:'HAYATO:', text:'THANK YOU FOR GUIDING MY BLADE.', delay:100},
  {speaker:'HAYATO:', text:'BUT THIS CHOICE IS NOT YOURS TO MAKE.', delay:120},
  {speaker:'HAYATO:', text:'YOU HAVE FOUGHT MY ENEMIES.', delay:100},
  {speaker:'HAYATO:', text:'YOU HAVE CROSSED MY SORROW.', delay:100},
  {speaker:'HAYATO:', text:'BUT YOU CANNOT BEAR IT FOR ME.', delay:100},
  {speaker:'HAYATO:', text:'THIS GRIEF IS MINE.', delay:80},
  {speaker:'HAYATO:', text:'THIS PROMISE IS MINE.', delay:80},
  {speaker:'HAYATO:', text:'THIS GOODBYE MUST BE MINE.', delay:100},
  {speaker:'', text:'HAYATO RAISES HIS SWORD.', delay:80},
  {speaker:'', text:'THE PLAYER CANNOT MOVE.', delay:80},
  {speaker:'', text:'FOR THE FIRST TIME...', delay:80},
  {speaker:'', text:'HAYATO ACTS ALONE.', delay:80},
  {speaker:'', text:'HE STRIKES THE MOONBLADE.', delay:80, isStrike:true},
  {speaker:'', text:'', delay:160},
  {speaker:'', text:'WHEN THE MOON RETURNS,', delay:100},
  {speaker:'', text:'SOME PROMISES REMAIN.', delay:200, isEnd:true},
];
let cutsceneChoice = 0; // 0=none, 1=break, 2=keep
let cutsceneChoiceShown = false;

function updateCutscene() {
  cutsceneTimer++;
  const line = cutsceneLines[cutsceneStep];
  if (!line) { gs = STATES.WIN; return; }

  if (line.isChoiceOpts && cutsceneChoice === 0) {
    // wait for choice
    if (justPressed['ArrowLeft'] || justPressed['KeyA']) cutsceneChoice = 1;
    if (justPressed['ArrowRight'] || justPressed['KeyD']) cutsceneChoice = 2;
    if ((justPressed['Enter'] || justPressed['Space']) && cutsceneChoice === 0) cutsceneChoice = 1;
    return;
  }

  if (cutsceneChar < line.text.length) {
    if (cutsceneTimer % 2 === 0) cutsceneChar++;
  } else if (cutsceneTimer > line.delay) {
    cutsceneStep++;
    cutsceneTimer = 0;
    cutsceneChar = 0;
    if (line.isEnd) {
      gs = STATES.WIN;
      playerFrozen = false;
    }
  }
}

function drawFrozenBattleScene(t) {
  if (!sceneSnapshot) return;
  const savedX = player.x, savedY = player.y, savedCam = camX;
  player.x = sceneSnapshot.playerX;
  player.y = sceneSnapshot.playerY;
  camX = sceneSnapshot.camX;
  const cx = Math.floor(camX);

  drawBackground();
  drawStars(t);
  for (let p of platforms) drawBuilding(p, cx, t);
  for (let l of lanterns) drawLantern(l, t);
  drawAmbientSakura();
  drawPlayer(t);
  if (boss) drawBoss(t);
  drawParticles();

  player.x = savedX;
  player.y = savedY;
  camX = savedCam;
}

function drawCutscene(t) {
  drawFrozenBattleScene(t);
  ctx.fillStyle = 'rgba(10,6,20,0.55)';
  ctx.fillRect(0, 0, BASE_W, BASE_H);

  // Petals
  for (let i=0; i<12; i++) {
    const a = cutsceneStep < 4 ? (t*0.03+i*0.5) : i*0.5;
    const px = BASE_W/2-40 + Math.sin(a)*60 + i*20;
    const py = BASE_H-60 + Math.cos(a)*20 - i*5;
    ctx.fillStyle = P.spiritPetal;
    ctx.globalAlpha = 0.7;
    ctx.fillRect(px%BASE_W, py%BASE_H, 2, 2);
  }
  ctx.globalAlpha = 1;

  // Text box
  ctx.fillStyle = 'rgba(0,0,0,0.82)';
  ctx.fillRect(0, BASE_H-70, BASE_W, 70);
  ctx.fillStyle = P.uiBorder;
  ctx.fillRect(0, BASE_H-70, BASE_W, 1);

  const line = cutsceneLines[cutsceneStep];
  if (!line) return;
  if (line.speaker) {
    pixelText(line.speaker, 10, BASE_H-64, P.textGold, 1);
  }
  const displayText = line.text.substr(0, cutsceneChar);
  const words = displayText.split(' ');
  let row = 0, rowText = '';
  for (let w of words) {
    const test = rowText ? rowText + ' ' + w : w;
    if (test.length > 28) { pixelText(rowText, 10, BASE_H-52+row*14, P.textWhite, 2); row++; rowText = w; }
    else rowText = test;
  }
  if (rowText) pixelText(rowText, 10, BASE_H-52+row*14, P.textWhite, 2);

  // Choice buttons
  if (line.isChoiceOpts) {
    const sel = cutsceneChoice;
    ctx.fillStyle = sel===1 ? P.uiEnergy : P.uiBorder;
    ctx.fillRect(BASE_W/2-80, BASE_H-25, 60, 14);
    pixelText('BREAK IT', BASE_W/2-75, BASE_H-24, sel===1?'#fff':P.textGray, 1);
    ctx.fillStyle = sel===2 ? P.uiEnergy : P.uiBorder;
    ctx.fillRect(BASE_W/2+20, BASE_H-25, 60, 14);
    pixelText('KEEP IT', BASE_W/2+25, BASE_H-24, sel===2?'#fff':P.textGray, 1);
    if (sel===0) {
      if (Math.floor(t*0.05)%2===0) pixelTextCenter('ARROW KEYS TO CHOOSE', BASE_H-40, P.textGold, 1);
    }
  }

  // Strike flash
  if (line.isStrike && cutsceneChar >= line.text.length) {
    ctx.fillStyle = 'rgba(100,100,255,0.4)';
    ctx.fillRect(0,0,BASE_W,BASE_H);
  }
}

// ── WIN SCREEN ────────────────────────────────────────────────────────────────
let winTimer = 0;
function drawWin() {
  winTimer++;
  ctx.fillStyle = '#050310';
  ctx.fillRect(0,0,BASE_W,BASE_H);

  // Moon
  const mx = BASE_W/2, my = BASE_H/2-60;
  ctx.fillStyle = 'rgba(200,180,100,0.12)';
  ctx.beginPath(); ctx.arc(mx, my, 28, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = P.moon;
  for(let r=my-16;r<=my+16;r++) {
    const hw=Math.round(Math.sqrt(16*16-(r-my)*(r-my)));
    ctx.fillRect(mx-hw,r,hw*2,1);
  }

  // Petals drifting
  for(let i=0;i<20;i++) {
    const px = ((winTimer*0.4+i*25)%BASE_W);
    const py = ((winTimer*0.3+i*14)%BASE_H);
    ctx.fillStyle = P.spiritPetal;
    ctx.globalAlpha = 0.6;
    ctx.fillRect(px,py,2,2);
    ctx.fillStyle = P.sakura;
    ctx.fillRect((px+6)%BASE_W,(py+6)%BASE_H,2,2);
  }
  ctx.globalAlpha=1;

  if (winTimer > 40) {
    pixelTextCenter('和', BASE_H/2-22, P.textGold, 3);
  }
  if (winTimer > 80) {
    pixelTextCenter('WHEN THE MOON RETURNS,', BASE_H/2+14, P.textWhite, 1);
    pixelTextCenter('SOME PROMISES REMAIN.', BASE_H/2+30, P.textWhite, 1);
  }
  if (winTimer > 180) {
    pixelTextCenter('THE END', BASE_H/2+48, P.textGold, 2);
    if (Math.floor(winTimer*0.04)%2===0) pixelTextCenter('PRESS ENTER TO RETURN TO TITLE', BASE_H-18, P.textGray, 1);
    if (justPressed['Enter']||justPressed['Space']) restartGame(true);
  }
}

// ── PHYSICS ───────────────────────────────────────────────────────────────────
const GRAVITY = 0.4, JUMP_VEL = -5.5, MOVE_SPEED = 1.05, MAX_FALL = 8;

function applyPhysics(ent, floorPlatforms) {
  const ew = ent.w || PLAYER_W;
  const eh = ent.h || PLAYER_H;
  ent.vy = Math.min(ent.vy + GRAVITY, MAX_FALL);
  const prevBottom = ent.y + eh;
  ent.x += ent.vx;
  ent.y += ent.vy;

  ent.onGround = false;
  for (let p of floorPlatforms) {
    if (ent.x + ew > p.x && ent.x < p.x + p.w) {
      const bottom = ent.y + eh;
      if (ent.vy >= 0 && bottom >= p.y && (prevBottom <= p.y + 4 || bottom <= p.y + 12)) {
        ent.y = p.y - eh;
        ent.vy = 0;
        ent.onGround = true;
      }
    }
  }
}

// ── UPDATE PLAYER ─────────────────────────────────────────────────────────────
function updatePlayer() {
  if (player.dead) {
    player.deathTimer--;
    if (player.deathTimer <= 0) { gs = STATES.GAMEOVER; gameOverTimer = 0; }
    return;
  }
  if (playerFrozen) {
    player.vx = 0;
    player.vy = 0;
    return;
  }

  // Horizontal movement
  const left = keys['ArrowLeft'] || keys['KeyA'];
  const right = keys['ArrowRight'] || keys['KeyD'];
  if (left) { player.vx = -MOVE_SPEED; player.facingRight = false; }
  else if (right) { player.vx = MOVE_SPEED; player.facingRight = true; }
  else player.vx *= 0.6;

  if (Math.abs(player.vx) < 0.1) player.vx = 0;

  // Run animation
  if (player.onGround && player.vx !== 0) {
    player.runTimer++;
    if (player.runTimer > 12) { player.runTimer = 0; player.runFrame = (player.runFrame + 1) % 6; }
  } else {
    player.runFrame = 0;
    player.runTimer = 0;
  }

  // Coyote time
  if (player.onGround) player.coyoteTime = 8; else if(player.coyoteTime>0) player.coyoteTime--;

  // Jump buffer
  if (justPressed['ArrowUp'] || justPressed['KeyW'] || justPressed['Space'] || justPressed['KeyZ']) player.jumpBuffer = 8;
  if (player.jumpBuffer > 0) player.jumpBuffer--;

  if (player.jumpBuffer > 0 && player.coyoteTime > 0) {
    player.vy = JUMP_VEL;
    player.coyoteTime = 0;
    player.jumpBuffer = 0;
    // Jump particles
    for(let i=0;i<4;i++) spawnParticle(player.x+PLAYER_W/2, player.y+PLAYER_H, (Math.random()-0.5)*2, -Math.random()*2, 12, P.roofAccent, 2, 0.1);
  }

  // Attack
  if (player.attackCooldown > 0) player.attackCooldown--;
  if ((justPressed['KeyX'] || justPressed['KeyJ']) && player.attackCooldown === 0) {
    player.attacking = true;
    player.attackTimer = 16;
    player.attackCooldown = 22;
    player.attackDir = getAttackDirection();
    player.attackHitBoss = false;
    player.attackHitIds = null;
    const v = ATTACK_VEC[player.attackDir];
    const len = Math.hypot(v[0], v[1]) || 1;
    const cx = player.x + PLAYER_W / 2;
    const cy = player.y + PLAYER_H / 2;
    for (let i = 0; i < 6; i++) {
      spawnParticle(
        cx + (v[0] / len) * (8 + i * 4),
        cy + (v[1] / len) * (8 + i * 4),
        (v[0] / len) * (1 + Math.random()),
        (v[1] / len) * (1 + Math.random()),
        8, P.playerSwordGlow, 1
      );
    }
  }
  if (player.attackTimer > 0) player.attackTimer--;
  else {
    player.attacking = false;
    player.attackHitBoss = false;
    player.attackHitIds = null;
  }

  // Timers
  if (player.hitTimer > 0) player.hitTimer--;
  if (player.invincible > 0) player.invincible--;

  // Physics
  applyPhysics(player, platforms);

  // Kill zone / out of bounds
  if (player.y > GROUND_Y) {
    // Fell into gap
    player.energy = 0;
    killPlayer();
    return;
  }
  // Left boundary
  if (player.x < 0) player.x = 0;

  collectHealthPickups();

  // Check hit by shurikens
  if (player.invincible === 0) {
    for (let s of shurikens) {
      if (!s.dead && player.x < s.x+6 && player.x+PLAYER_W > s.x && player.y < s.y+6 && player.y+PLAYER_H > s.y) {
        s.dead = true;
        hitPlayer();
        break;
      }
    }
    for (let s of bossShurikens) {
      if (!s.dead && player.x < s.x+8 && player.x+PLAYER_W > s.x && player.y < s.y+8 && player.y+PLAYER_H > s.y) {
        s.dead = true;
        hitPlayer();
        break;
      }
    }
  }

  if (player.attacking && player.attackTimer > 6) {
    const dir = player.attackDir || getAttackDirection();
    if (!player.attackHitIds) player.attackHitIds = new Set();

    for (let e of enemies) {
      if (e.dead || player.attackHitIds.has(e)) continue;
      if (slashHitsTarget(e, dir)) {
        player.attackHitIds.add(e);
        e.hp--;
        e.hitFlash = 8;
        player.score += 30;
        for (let i=0;i<4;i++) spawnParticle(e.x+e.w/2-camX, e.y+e.h/2, (Math.random()-0.5)*3, -Math.random()*2-0.5, 12, P.blood, 2, 0.1);
        if (e.hp <= 0) killEnemy(e);
      }
    }

    if (boss && !boss.dead && gs === STATES.BOSS && !player.attackHitBoss) {
      if (slashHitsTarget(boss, dir)) {
        player.attackHitBoss = true;
        bossHP -= BOSS_ATTACK_POWER;
        boss.hitFlash = 8;
        moonbladeFlash = 12;
        spawnBossHitPill();
        for (let i=0;i<5;i++) spawnParticle(boss.x+boss.w/2-camX, boss.y+boss.h/2, (Math.random()-0.5)*3, -Math.random()*3, 15, '#8080ff', 2, 0.1);
        for (let i=0;i<3;i++) spawnParticle(boss.x+boss.w/2-camX, boss.y+boss.h/2, (Math.random()-0.5)*2, -1-Math.random()*2, 12, '#d03030', 2, 0.06);
        if (bossHP <= 0) defeatBoss();
      }
    }
  }

  // Boss melee hit on player
  if (boss && !boss.dead && gs === STATES.BOSS && player.invincible === 0) {
    if (bossAction === 'slash' && Math.abs(player.x - boss.x) < 40 && Math.abs(player.y - boss.y) < 30) {
      hitPlayer();
    }
  }
}

function hitPlayer() {
  if (player.invincible > 0) return;
  player.energy--;
  player.hitTimer = 10;
  player.invincible = 60;
  player.vy = -3;
  player.vx = player.facingRight ? -2 : 2;
  for(let i=0;i<8;i++) spawnParticle(player.x+PLAYER_W/2-camX, player.y+PLAYER_H/2, (Math.random()-0.5)*3, -Math.random()*2, 15, P.uiEnergy, 2, 0.08);
  if (player.energy <= 0) killPlayer();
}

function killPlayer() {
  if (player.dead) return;
  player.dead = true;
  player.deathTimer = 60;
  for(let i=0;i<20;i++) spawnParticle(player.x+PLAYER_W/2-camX, player.y+PLAYER_H/2, (Math.random()-0.5)*4, -Math.random()*4, 30, P.playerCloak2, 2, 0.1);
}

// ── UPDATE ENEMIES ────────────────────────────────────────────────────────────
function updateEnemies() {
  for (let e of enemies) {
    if (e.dead) { if(e.deathTimer>0)e.deathTimer--; continue; }
    if (e.hitFlash > 0) e.hitFlash--;

    const dx = (player.x + PLAYER_W/2) - (e.x + e.w/2);
    const distX = Math.abs(dx);

    // Patrol / chase
    if (distX < 120) {
      e.state = 'chase';
      e.facingRight = dx > 0;
      e.vx = dx > 0 ? 0.8 : -0.8;
      e.throwTimer--;
      if (e.throwTimer <= 0 && distX > 30) {
        e.throwTimer = 80 + Math.floor(Math.random()*60);
        const spd = dx > 0 ? 3 : -3;
        shurikens.push({x:e.x+e.w/2, y:e.y+6, vx:spd, vy:(Math.random()-0.5)*0.5, rot:0, dead:false});
      }
    } else {
      e.state = 'patrol';
      e.patrolTimer++;
      if (e.patrolTimer > 60) { e.patrolDir *= -1; e.patrolTimer = 0; }
      e.vx = e.patrolDir * 0.5;
      e.facingRight = e.patrolDir > 0;
    }

    const nextX = e.x + e.vx;
    const onPlat = getPlatformAt(nextX, e.w, e.y+e.h);
    if (!onPlat) { e.vx = 0; e.patrolDir *= -1; }

    applyPhysics(e, platforms);
    if (e.y > GROUND_Y) { e.dead = true; }

    // Melee contact with player
    if (!playerFrozen && gs !== STATES.BOSS_INTRO &&
        player.invincible === 0 && !player.dead &&
        e.x < player.x+PLAYER_W && e.x+e.w > player.x &&
        e.y < player.y+PLAYER_H && e.y+e.h > player.y) {
      hitPlayer();
    }
  }
}

// ── UPDATE SHURIKENS ──────────────────────────────────────────────────────────
function updateShurikens() {
  shurikens = shurikens.filter(s => {
    if (s.dead) return false;
    s.x += s.vx; s.y += s.vy; s.rot += 0.3;
    // Check platform collision
    const camOff = s.x; // world coords
    for (let p of platforms) {
      if (camOff > p.x && camOff < p.x+p.w && s.y > p.y && s.y < p.y+p.h+4) {
        for(let i=0;i<3;i++) spawnParticle(s.x-camX, s.y, (Math.random()-0.5)*2, -Math.random()*2, 8, P.ninjaStar, 1);
        return false;
      }
    }
    return s.x > camX-20 && s.x < camX+BASE_W+20;
  });
}

// ── UPDATE BOSS ───────────────────────────────────────────────────────────────
function updateBoss() {
  if (!boss || boss.dead) return;
  if (boss.hitFlash > 0) boss.hitFlash--;
  if (moonbladeFlash > 0) moonbladeFlash--;

  bossActionTimer--;
  boss.facingRight = player.x > boss.x;

  const bossPlat = platforms.find(p=>p.isBoss);
  const floorY = bossPlat ? bossPlat.y : 130;

  // Gravity
  boss.vy += GRAVITY;
  boss.y += boss.vy;
  if (boss.y + boss.h >= floorY) { boss.y = floorY - boss.h; boss.vy = 0; }

  // Keep in arena
  boss.x += boss.vx;
  if (bossPlat) {
    boss.x = Math.max(bossPlat.x+4, Math.min(bossPlat.x+bossPlat.w-boss.w-4, boss.x));
  }

  const phase = bossHP > BOSS_MAX_HP*0.66 ? 1 : bossHP > BOSS_MAX_HP*0.33 ? 2 : 3;
  bossPhase = phase;

  if (phase === 3 && Math.random() < 0.01) {
    spawnSpiritPetal(player.x + (Math.random()-0.5)*60, player.y - 20, (Math.random()-0.5)*0.8, (Math.random()-0.5)*0.8);
  }

  // Actions
  if (bossActionTimer <= 0) {
    const roll = Math.random();
    const speed = 1 + phase*0.5;
    if (roll < 0.25) {
      bossAction = 'slash';
      boss.vx = boss.facingRight ? speed*1.5 : -speed*1.5;
      bossActionTimer = 30;
    } else if (roll < 0.5) {
      bossAction = 'shuriken';
      // Fan pattern
      const count = 1 + phase;
      for (let i=0; i<count; i++) {
        const ang = (-0.3 + i*(0.6/Math.max(1,count-1)));
        const spd = 2.5 + phase*0.5;
        const dx2 = (boss.facingRight?1:-1)*Math.cos(ang)*spd;
        const dy2 = Math.sin(ang)*spd - 0.5;
        bossShurikens.push({x:boss.x+boss.w/2, y:boss.y+boss.h/2, vx:dx2, vy:dy2, rot:0, dead:false});
      }
      bossAction = 'idle';
      bossActionTimer = 60 - phase*10;
    } else if (roll < 0.7 && bossPhase >= 2) {
      bossAction = 'jump';
      boss.vy = -6;
      bossActionTimer = 50;
    } else if (roll < 0.85 && bossPhase >= 2) {
      // Spawn kurohane
      bossAction = 'summon';
      const kx = bossPlat ? bossPlat.x + Math.random()*bossPlat.w : boss.x;
      bossKurohane.push({x:kx, y:floorY-16, w:8, h:14, vx:player.x>kx?0.8:-0.8, vy:0, hp:1, hitFlash:0, dead:false, deathTimer:0, roofY:floorY});
      bossActionTimer = 40;
    } else {
      bossAction = 'move';
      boss.vx = (player.x > boss.x ? 1 : -1) * speed;
      bossActionTimer = 40;
    }
  }

  if (bossAction === 'idle' || bossAction === 'shuriken' || bossAction === 'summon') boss.vx *= 0.9;

  // Update boss shurikens
  bossShurikens = bossShurikens.filter(s => {
    if (s.dead) return false;
    s.x += s.vx; s.y += s.vy; s.vy += 0.05; s.rot += 0.3;
    for (let p of platforms) {
      if (s.x > p.x && s.x < p.x+p.w && s.y+8 > p.y && s.y < p.y+8) return false;
    }
    return s.x > camX-20 && s.x < camX+BASE_W+40 && s.y < BASE_H+20;
  });

  // Update kurohane
  for (let k of bossKurohane) {
    if (k.dead) { if(k.deathTimer>0)k.deathTimer--; continue; }
    if (k.hitFlash>0) k.hitFlash--;
    k.vx = player.x > k.x ? 0.9 : -0.9;
    applyPhysics(k, platforms);
    if (player.invincible === 0 && !player.dead && k.x < player.x+PLAYER_W && k.x+k.w > player.x && k.y < player.y+PLAYER_H && k.y+k.h > player.y) hitPlayer();
    if (player.attacking && player.attackTimer > 6) {
      const dir = player.attackDir || getAttackDirection();
      if (slashHitsTarget(k, dir)) {
        k.dead=true; k.deathTimer=20;
        spawnMedicinePill(k.x + k.w / 2, k.y + k.h);
        for(let i=0;i<4;i++) spawnParticle(k.x+4-camX, k.y+7, (Math.random()-0.5)*3, -Math.random()*2, 12, P.ninjaBody, 2, 0.1);
      }
    }
  }
  bossKurohane = bossKurohane.filter(k=>k.deathTimer===undefined||k.deathTimer>0||!k.dead);
}

function defeatBoss() {
  boss.dead = true;
  bossDefeated = true;
  saveSceneSnapshot();
  playerFrozen = true;
  bossDefeatTimer = 120;
  player.vx = 0;
  player.vy = 0;
  for(let i=0;i<30;i++) spawnParticle(boss.x+10-camX, boss.y+14, (Math.random()-0.5)*5, -Math.random()*5, 40, Math.random()>0.5?'#8080ff':'#cc2244', 2, 0.1);
}

// ── CAMERA ────────────────────────────────────────────────────────────────────
function updateCamera() {
  camTargetX = player.x - BASE_W*0.35;
  camTargetX = Math.max(0, Math.min(totalWidth - BASE_W, camTargetX));
  camX += (camTargetX - camX) * 0.12;
  if (Math.abs(camX - camTargetX) < 0.5) camX = camTargetX;
}

// ── BOSS TRIGGER ──────────────────────────────────────────────────────────────
function checkBossTrigger() {
  const bossPlat = platforms.find(p=>p.isBoss);
  if (bossPlat && player.x > bossPlat.x - 30 && gs === STATES.PLAYING) {
    gs = STATES.BOSS_INTRO;
    bossIntroTimer = 0;
  }
}

// ── RESTART ───────────────────────────────────────────────────────────────────
function restartGame(toTitle=false) {
  resetPlayer();
  camX = 0;
  particles = [];
  shurikens = [];
  bossShurikens = [];
  boss = null;
  bossKurohane = [];
  bossDefeated = false;
  moonbladeVulnerable = false;
  petals = [];
  medicinePills = [];
  healPopups = [];
  populateEnemies();
  winTimer = 0; gameOverTimer = 0;
  playerFrozen = false;
  bossDefeatTimer = 0;
  sceneSnapshot = null;
  if (toTitle) { gs = STATES.TITLE; titleT = 0; }
  else { gs = STATES.PLAYING; }
}

// ── MAIN LOOP ─────────────────────────────────────────────────────────────────
let t = 0;
function loop() {
  requestAnimationFrame(loop);
  t++;
  ctx.imageSmoothingEnabled = false;

  if (gs === STATES.TITLE) {
    drawTitle();
    if (justPressed['Enter'] || justPressed['Space']) { gs = STATES.INTRO; introLine=0; introChar=0; introTimer=0; }
  } else if (gs === STATES.INTRO) {
    updateIntro();
    drawIntro();
  } else if (gs === STATES.PLAYING || gs === STATES.BOSS || gs === STATES.BOSS_INTRO) {
    updateWorldAmbient();
    updatePetals();
    updateEnemies();
    updateShurikens();
    updateMedicinePills();
    updateHealPopups();

    if (gs === STATES.PLAYING) {
      if (!playerFrozen) updatePlayer();
      if (!playerFrozen) updateCamera();
      checkBossTrigger();
    } else if (gs === STATES.BOSS) {
      if (bossDefeatTimer > 0) {
        bossDefeatTimer--;
        if (bossDefeatTimer === 0) {
          saveSceneSnapshot();
          gs = STATES.CUTSCENE;
          cutsceneStep = 0;
          cutsceneTimer = 0;
          cutsceneChar = 0;
          cutsceneChoice = 0;
        }
      } else if (!playerFrozen) {
        updatePlayer();
        updateBoss();
      }
      if (!playerFrozen) updateCamera();
    } else if (gs === STATES.BOSS_INTRO) {
      updateBossIntro();
    }
    updateParticles();

    if (playerFrozen && sceneSnapshot) {
      player.x = sceneSnapshot.playerX;
      player.y = sceneSnapshot.playerY;
      camX = sceneSnapshot.camX;
    }

    drawBackground();
    drawStars(t);
    drawAmbientSakura();

    const cx = Math.floor(camX);
    for (let p of platforms) drawBuilding(p, cx, t);
    for (let l of lanterns) drawLantern(l, t);
    for (let p of petals) drawPetal(p, t);
    for (let e of enemies) drawNinja(e);
    for (let s of shurikens) drawShuriken(s);
    for (let s of bossShurikens) drawBossShuriken(s);
    for (let k of bossKurohane) {
      if (!k.dead || k.deathTimer > 0) {
        const ksx = Math.floor(k.x - cx), ksy = Math.floor(k.y);
        ctx.fillStyle = k.hitFlash>0?'#ff8800':P.ninjaBody;
        ctx.fillRect(ksx, ksy, k.w, k.h);
        ctx.fillStyle = P.ninjaEye;
        ctx.fillRect(ksx+(k.vx>0?5:1), ksy+4, 2, 1);
      }
    }
    drawPlayer(t);
    if (gs === STATES.BOSS && boss) drawBoss(t);
    drawParticles();
    drawHUD();

    if (gs === STATES.BOSS_INTRO) {
      ctx.fillStyle='rgba(0,0,0,0.7)';
      ctx.fillRect(0,0,BASE_W,BASE_H);
      drawBossIntro();
    }
  } else if (gs === STATES.CUTSCENE) {
    updateCutscene();
    drawCutscene(t);
  } else if (gs === STATES.GAMEOVER) {
    drawGameOver();
  } else if (gs === STATES.WIN) {
    drawWin();
  }

  clearJust();
}

loop();
