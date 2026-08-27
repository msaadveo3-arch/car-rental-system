import { SceneSetup } from './scene.js';
import { ModelLoader } from './loader.js';
import { MarkersManager } from './zones.js';
import { PopupManager } from './popup.js';
import { DamageData } from './data.js';
import { PDFGenerator } from './pdf.js';

const PROGRESS_TARGET = 10;

/* ---------- أيقونات ---------- */
const ICO = {
    eye:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>',
    photo: '<svg class="ph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="m21 16-5-5L5 20"/></svg>',
    up:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="m6 11 6-6 6 6"/></svg>',
    down:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m6 13 6 6 6-6"/></svg>',
    // أيقونات نوع الضرر (تظهر داخل المربع الرمادي)
    scratch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 19 19 5"/><path d="M9.5 19 19 9.5"/><path d="M5 14.5 14.5 5"/></svg>',
    crack:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/></svg>',
    impact:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>',
    flame:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c1 3 4 4.2 4 8a4 4 0 0 1-8 0c0-1.8.9-2.9 1.8-3.8.2 1 .9 1.8 1.7 1.8 0-2.2-1-4 0-6Z"/></svg>',
    rust:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="9" r="2"/><circle cx="15" cy="8" r="1.4"/><circle cx="13.5" cy="14.5" r="2.4"/><circle cx="7" cy="15" r="1.2"/></svg>',
    warn:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>'
};

function iconForType(type) {
    const t = (type || '').trim();
    if (t.includes('خدش'))   return ICO.scratch;
    if (t.includes('كسر'))    return ICO.crack;
    if (t.includes('اصطدام')) return ICO.impact;
    if (t.includes('حرق'))    return ICO.flame;
    if (t.includes('صدأ'))    return ICO.rust;
    return ICO.warn;
}

const LEVEL = {
    'شديد':  { cls: 'severe',   arrow: ICO.up },
    'متوسط': { cls: 'moderate', arrow: ICO.up },
    'بسيط':  { cls: 'minor',    arrow: ICO.down }
};
const levelMeta = (lvl) => LEVEL[lvl] || { cls: 'minor', arrow: ICO.down };

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

function footNote(r) {
    const n = (r.notes || '').trim();
    if (n) return `<span class="note-txt">${esc(n)}</span>`;
    const imgs = r.images || [];
    if (imgs.length) {
        const c = imgs.length;
        return `<span class="note-photos">${ICO.photo}<span class="note-txt">${c} صورة مرفقة</span></span>`;
    }
    return `<span class="note-txt note-empty">لا توجد ملاحظات مرفقة</span>`;
}

class CarReportApp {
    constructor() {
        this.canvas = document.getElementById('webgl');
        this.sceneSetup = new SceneSetup(this.canvas);
        this.modelLoader = new ModelLoader(this.sceneSetup.getScene());
        this.damageData = new DamageData();
        this.popupManager = new PopupManager(this.damageData);
        this.markers = new MarkersManager(this.sceneSetup.getScene());
        this.pdfGenerator = new PDFGenerator(this.damageData);

        this.carModel = null;
        this.lastFrame = -1;

        this.sceneSetup.onAutoRotateChange = (on) => {
            const b = document.querySelector('.tool[data-tool="autorotate"]');
            if (b) b.classList.toggle('is-active', on);
        };

        this.el = {
            date: document.getElementById('spec-date'),
            fill: document.getElementById('progress-fill'),
            issues: document.getElementById('issues-count'),
            clear: document.getElementById('clear-link'),
            frame: document.getElementById('frame-now'),
            list: document.getElementById('damage-list'),
            empty: document.getElementById('damage-empty'),
            count: document.getElementById('damage-count'),
        };

        this.init();
        this.setupTools();
        this.setupCanvas();
        this.setupSidebar();
        this.animate();
    }

    async init() {
        if (this.el.date) {
            this.el.date.textContent = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
        try {
            this.carModel = await this.modelLoader.loadModel('./models/car.glb');
            this.sceneSetup.fitToView(this.carModel);
            this.sceneSetup.resetView();
        } catch (e) {
            console.error(e);
            alert('فشل تحميل car.glb — شغّل المشروع عبر Local Server (لا تفتح الملف مباشرة).');
        }
        this.renderList();
        this.updateProgress();
    }

    /* ===================== شريط الأدوات ===================== */
    setupTools() {
        document.querySelectorAll('.tool').forEach(btn => {
            btn.addEventListener('click', () => {
                switch (btn.dataset.tool) {
                    case 'autorotate': this.sceneSetup.toggleAutoRotate(); break;
                    case 'inspect':
                        btn.classList.toggle('is-active');
                        this.markers.setHighlight(btn.classList.contains('is-active'));
                        break;
                    case 'fit':       this.sceneSetup.fitToView(this.carModel); break;
                    case 'zoomin':    this.sceneSetup.zoomIn();  break;
                    case 'zoomout':   this.sceneSetup.zoomOut(); break;
                    case 'wireframe':
                        this.sceneSetup.toggleWireframe(this.carModel);
                        btn.classList.toggle('is-active');
                        break;
                }
            });
        });
    }

    /* ===================== الكانفس ===================== */
    setupCanvas() {
        this.canvas.addEventListener('click', (e) => {
            const pick = this.markers.pick(e, this.sceneSetup.getCamera(), this.canvas, this.carModel);
            if (!pick) return;
            if (pick.type === 'marker') {
                const rec = this.damageData.getRecord(pick.recordId);
                if (rec) this.popupManager.open({ record: rec }, this.onSave.bind(this));
            } else {
                this.popupManager.open({ position: pick.position, normal: pick.normal }, this.onSave.bind(this));
            }
        });

        this.canvas.addEventListener('mousemove', (e) => {
            const pick = this.markers.pick(e, this.sceneSetup.getCamera(), this.canvas, this.carModel);
            if (pick && pick.type === 'marker') {
                this.markers.setHover(pick.recordId);
                this.canvas.style.cursor = 'pointer';
            } else {
                this.markers.clearHover();
                this.canvas.style.cursor = pick ? 'pointer' : 'default';
            }
        });
    }

    /* ===================== الشريط الجانبي ===================== */
    setupSidebar() {
        document.getElementById('btn-pdf').addEventListener('click', () => this.pdfGenerator.generateReport());
        document.getElementById('btn-reset').addEventListener('click', () => this.sceneSetup.resetView());
        this.el.clear.addEventListener('click', () => {
            if (confirm('مسح كافة بيانات الفحص والدبابيس؟')) {
                this.damageData.clearAll();
                this.markers.removeAll();
                this.renderList();
                this.updateProgress();
            }
        });
    }

    /* ===================== بعد الحفظ ===================== */
    onSave(recordId, mode, position) {
        if (mode === 'create') {
            if (position) this.markers.addMarker(recordId, position);
            this.addCardElement(this.damageData.getRecord(recordId));
        } else {
            this.updateCardElement(this.damageData.getRecord(recordId));
        }
        this.updateProgress();
    }

    /* ===================== بناء البطاقة ===================== */
    buildCard(record) {
        const meta = levelMeta(record.damageLevel);
        const card = document.createElement('article');
        card.className = 'damage-card';
        card.dataset.id = record.id;
        card.dataset.level = meta.cls;
        card.setAttribute('dir', 'rtl');
        card.innerHTML = `
            <div class="card-top">
                <div class="card-ico" aria-hidden="true">${iconForType(record.damageType)}</div>
                <div class="card-mid">
                    <span class="card-eyebrow">${esc(record.damageType) || 'ضرر مسجّل'}</span>
                    <h3 class="card-title">${esc(record.part) || '(بدون اسم)'}</h3>
                </div>
                <span class="card-badge">${meta.arrow}<span class="badge-txt">${esc(record.damageLevel) || '—'}</span></span>
            </div>
            <div class="card-foot">
                <span class="card-note">${footNote(record)}</span>
                <div class="card-ops">
                    <button class="op op-details" type="button" title="التفاصيل" aria-label="التفاصيل">${ICO.eye}</button>
                    <button class="op op-delete" type="button" title="حذف" aria-label="حذف">${ICO.trash}</button>
                </div>
            </div>
        `;
        card.querySelector('.op-details').addEventListener('click', () => {
            const rec = this.damageData.getRecord(record.id);
            if (rec) this.popupManager.open({ record: rec }, this.onSave.bind(this));
        });
        card.querySelector('.op-delete').addEventListener('click', () => this.handleDelete(record.id));
        return card;
    }

    renderList() {
        this.el.list.innerHTML = '';
        const recs = this.damageData.getAllRecords();
        recs.forEach((r, i) => {
            const card = this.buildCard(r);
            card.style.animationDelay = Math.min(i * 45, 400) + 'ms';
            this.el.list.appendChild(card);
        });
        this.syncEmpty();
        this.bumpCount();
    }

    addCardElement(record) {
        if (!record) return;
        const card = this.buildCard(record);
        card.classList.add('is-new');
        this.el.list.appendChild(card);
        this.syncEmpty();
        this.bumpCount();
        requestAnimationFrame(() => {
            this.el.list.scrollTo({ top: this.el.list.scrollHeight, behavior: 'smooth' });
        });
    }

    updateCardElement(record) {
        if (!record) return;
        const old = this.el.list.querySelector(`.damage-card[data-id="${record.id}"]`);
        const fresh = this.buildCard(record);
        if (old) {
            old.replaceWith(fresh);
            fresh.classList.add('is-updated');
            setTimeout(() => fresh.classList.remove('is-updated'), 850);
        } else {
            this.addCardElement(record);
        }
    }

    handleDelete(id) {
        const card = this.el.list.querySelector(`.damage-card[data-id="${id}"]`);
        if (!card || card.classList.contains('is-removing')) return;
        card.classList.add('is-removing');
        setTimeout(() => {
            this.damageData.removeRecord(id);
            this.markers.removeMarker(id);
            card.remove();
            this.updateProgress();
            this.syncEmpty();
            this.bumpCount();
        }, 300);
    }

    syncEmpty() {
        const has = this.el.list.querySelectorAll('.damage-card:not(.is-removing)').length > 0;
        this.el.empty.hidden = has;
        this.el.list.hidden = !has;
    }

    bumpCount() {
        const n = this.damageData.count();
        this.el.count.textContent = n;
        this.el.count.classList.remove('bump');
        void this.el.count.offsetWidth;
        this.el.count.classList.add('bump');
        setTimeout(() => this.el.count.classList.remove('bump'), 260);
    }

    /* ===================== التقدّم ===================== */
    updateProgress() {
        const issues = this.damageData.count();
        const pct = Math.min(100, (issues / PROGRESS_TARGET) * 100);
        this.el.fill.style.width = pct + '%';
        this.el.issues.textContent = issues + (issues === 1 ? ' issue found' : ' issues found');
        this.el.clear.hidden = issues === 0;
    }

    /* ===================== العدّاد 1/36 ===================== */
    updateCounter() {
        const a = this.sceneSetup.getControls().getAzimuthalAngle();
        const frame = Math.floor(((a + Math.PI) / (2 * Math.PI)) * 36) % 36 + 1;
        if (frame !== this.lastFrame) {
            this.lastFrame = frame;
            this.el.frame.textContent = frame;
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.sceneSetup.getControls().update();
        this.updateCounter();
        this.sceneSetup.getRenderer().render(this.sceneSetup.getScene(), this.sceneSetup.getCamera());
    }
}

window.addEventListener('load', () => new CarReportApp());