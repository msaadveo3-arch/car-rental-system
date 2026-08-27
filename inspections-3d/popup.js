export class PopupManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.modal = document.getElementById('popup-modal');
        this.title = document.getElementById('popup-title');
        this.form = document.getElementById('damage-form');
        this.closeBtn = document.querySelector('.close');
        this.editingId = null;
        this.pendingPosition = null;
        this.existingImages = [];
        this.onSaveCallback = null;
        this.setupEvents();
        this.setupParentBridge();
    }

    setupEvents() {
        this.closeBtn.onclick = () => this.close();
        window.onclick = (e) => { if (e.target === this.modal) this.close(); };
        this.form.onsubmit = (e) => { e.preventDefault(); this.handleSave(); };
    }

    /* ========== الجسر مع صفحة الـ CarRental ========== */
    setupParentBridge() {
        var self = this;

        // تحديث القائمة بعد حذف
        window.addEventListener('patch-notify', function () {
            self.notifyParent();
        });

        // تعديل ضرر من الصفحة الأم
        window.addEventListener('patch-update', function (ev) {
            var d = ev.detail || {};
            var recs = self.getRecords();
            var rec = recs[d.index];
            if (!rec) return;
            self.dataManager.updateRecord(rec.id, {
                part: (d.data && d.data.part) || '',
                damageType: (d.data && d.data.type) || '',
                damageLevel: (d.data && d.data.severity) || '',
                notes: (d.data && d.data.notes) || '',
                images: (d.data && d.data.photos && d.data.photos.length)
                    ? d.data.photos
                    : (rec.images || []),
            });
            self.notifyParent();
        });
    }

    getRecords() {
        var dm = this.dataManager;
        if (!dm) return [];
        if (Array.isArray(dm.records)) return dm.records;
        if (Array.isArray(dm.data)) return dm.data;
        if (Array.isArray(dm.items)) return dm.items;
        if (Array.isArray(dm.list)) return dm.list;
        for (var k in dm) {
            if (Object.prototype.hasOwnProperty.call(dm, k) && Array.isArray(dm[k]) &&
                dm[k].length && dm[k][0] &&
                (dm[k][0].part !== undefined || dm[k][0].damageType !== undefined)) {
                return dm[k];
            }
        }
        return [];
    }

    toEnglish(v) {
        var map = {
            'خدش (Scratch)': 'Scratch', 'خدش': 'Scratch',
            'كسر (Crack)': 'Crack', 'كسر': 'Crack',
            'اصطدام (Collision)': 'Collision', 'اصطدام': 'Collision',
            'حروق (Burn)': 'Burn', 'حروق': 'Burn',
            'صدأ (Rust)': 'Rust', 'صدأ': 'Rust',
            'أخرى': 'Other',
            'بسيط (Minor)': 'Minor', 'بسيط': 'Minor',
            'متوسط (Moderate)': 'Moderate', 'متوسط': 'Moderate',
            'شديد (Severe)': 'Severe', 'شديد': 'Severe',
        };
        v = String(v || '').trim();
        return map[v] || v;
    }

    notifyParent() {
        try {
            var self = this;
            var list = this.getRecords().map(function (r) {
                return {
                    part: r.part || '',
                    type: self.toEnglish(r.damageType),
                    severity: self.toEnglish(r.damageLevel),
                    notes: r.notes || '',
                    photos: r.images || [],
                };
            });
            if (window.parent && window.parent !== window) {
                window.parent.postMessage({ type: 'damages-update', data: list }, '*');
            }
        } catch (e) {}
    }
    /* ================================================== */

    open(payload, onSave) {
        this.onSaveCallback = onSave;
        if (payload && payload.record) {
            const r = payload.record;
            this.editingId = r.id;
            this.pendingPosition = r.position || null;
            this.existingImages = r.images || [];
            this.title.textContent = 'Edit Damage';
            this.form.part.value = r.part || '';
            this.form.damageType.value = r.damageType || '';
            this.form.damageLevel.value = r.damageLevel || '';
            this.form.notes.value = r.notes || '';
            this.form.images.value = '';
        } else {
            this.editingId = null;
            this.existingImages = [];
            const p = payload && payload.position;
            this.pendingPosition = (p && p.isVector3) ? { x: p.x, y: p.y, z: p.z } : (p || null);
            this.title.textContent = 'New Damage';
            this.form.reset();
        }
        this.modal.style.display = 'block';
        setTimeout(() => { try { this.form.part.focus(); } catch (e) {} }, 60);
    }

    close() {
        this.modal.style.display = 'none';
        this.editingId = null;
        this.pendingPosition = null;
        this.existingImages = [];
    }

    handleSave() {
        const fd = new FormData(this.form);
        const part = (fd.get('part') || '').trim();
        if (!part) { alert('Please write the name of the part/location of the damage.'); this.form.part.focus(); return; }
        const files = fd.getAll('images');
        Promise.all(files.map(f => this.fileToBase64(f))).then(imgs => {
            let finalImages = imgs.filter(Boolean);
            if (finalImages.length === 0) finalImages = this.existingImages;
            const data = {
                part,
                damageType: fd.get('damageType'),
                damageLevel: fd.get('damageLevel'),
                notes: fd.get('notes'),
                images: finalImages
            };
            if (this.editingId) {
                this.dataManager.updateRecord(this.editingId, data);
                if (this.onSaveCallback) this.onSaveCallback(this.editingId, 'update', null);
            } else {
                data.position = this.pendingPosition;
                const id = this.dataManager.addRecord(data);
                if (this.onSaveCallback) this.onSaveCallback(id, 'create', this.pendingPosition);
            }
            this.close();
            this.notifyParent();
        });
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            if (!(file instanceof File)) return resolve(null);
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
}