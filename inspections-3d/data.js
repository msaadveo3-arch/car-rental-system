// البيانات الآن مصفوفة سجلات (كل ضغطة = سجل مستقل بمعرف فريد + إحداثيات الدبوس)
export class DamageData {
    constructor() {
        this.records = [];
        this._seq = 0;
    }

    _id() { return 'r' + (++this._seq) + '-' + Date.now().toString(36); }

    addRecord({ part, damageType, damageLevel, notes, images, position }) {
        const id = this._id();
        this.records.push({
            id,
            part: part || '',
            damageType: damageType || '',
            damageLevel: damageLevel || '',
            notes: notes || '',
            images: images || [],
            position: position || null   // {x,y,z}
        });
        return id;
    }

    updateRecord(id, patch) {
        const r = this.getRecord(id);
        if (r) Object.assign(r, patch);
    }

    getRecord(id) { return this.records.find(r => r.id === id) || null; }
    getAllRecords() { return this.records.slice(); }
    removeRecord(id) { this.records = this.records.filter(r => r.id !== id); }
    clearAll() { this.records = []; }
    count() { return this.records.length; }
}