import * as THREE from 'three';

// لم يعد هذا الملف "مناطق ثابتة"، بل مدير دبابيس الأضرار + أداة اختيار نقطة على السيارة.
export class MarkersManager {
    constructor(scene) {
        this.scene = scene;
        this.markers = {};          // recordId -> { group, dot, halo, hit }
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.hoveredId = null;
        this.highlight = false;     // وضع إبراز الدبابيس (زر العدسة)
    }

    _updateMouse(event, camera, domElement) {
        const rect = domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, camera);
    }

    /**
     * يرجع:
     *  { type:'marker', recordId }   عند الضغط على دبوس موجود (تعديل)
     *  { type:'car', position, normal } عند الضغط على سطح السيارة (جديد)
     *  null عند الضغط على الخلفية
     */
    pick(event, camera, domElement, carModel) {
        this._updateMouse(event, camera, domElement);

        // 1) الدبابيس أولاً (منطقة النقر الشفافة)
        const hitMeshes = Object.values(this.markers).map(m => m.hit);
        if (hitMeshes.length) {
            const hm = this.raycaster.intersectObjects(hitMeshes, false);
            if (hm.length) {
                const id = hm[0].object.userData.recordId;
                if (id) return { type: 'marker', recordId: id };
            }
        }

        // 2) سطح السيارة الحقيقي
        if (carModel) {
            const hc = this.raycaster.intersectObject(carModel, true);
            if (hc.length) {
                const hit = hc[0];
                const normal = hit.face.normal.clone()
                    .transformDirection(hit.object.matrixWorld).normalize();
                // إزاحة بسيطة على طول الناظم لتجنب غرق الدبوس في السطح
                const position = hit.point.clone().add(normal.clone().multiplyScalar(0.02));
                return { type: 'car', position, normal };
            }
        }
        return null;
    }

    addMarker(recordId, position) {
        const group = new THREE.Group();

        const dot = new THREE.Mesh(
            new THREE.SphereGeometry(0.035, 24, 24),
            new THREE.MeshStandardMaterial({
                color: 0xef4444, emissive: 0x7f1d1d, emissiveIntensity: 0.6,
                roughness: 0.3, metalness: 0.1
            })
        );

        const halo = new THREE.Mesh(
            new THREE.SphereGeometry(0.06, 24, 24),
            new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.25, depthWrite: false })
        );

        // كرة نقر شفافة أكبر لراحة الضغط على الدبوس
        const hit = new THREE.Mesh(
            new THREE.SphereGeometry(0.085, 16, 16),
            new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
        );
        hit.userData.recordId = recordId;

        group.add(halo, dot, hit);
        group.position.set(position.x, position.y, position.z);
        this.scene.add(group);

        this.markers[recordId] = { group, dot, halo, hit };
        this._applyHighlight();
    }

    removeMarker(recordId) {
        const m = this.markers[recordId];
        if (!m) return;
        this.scene.remove(m.group);
        [m.dot, m.halo, m.hit].forEach(o => {
            o.geometry.dispose();
            o.material.dispose();
        });
        delete this.markers[recordId];
        if (this.hoveredId === recordId) this.hoveredId = null;
    }

    removeAll() {
        Object.keys(this.markers).forEach(id => this.removeMarker(id));
        this.hoveredId = null;
    }

    setHover(recordId) {
        if (this.hoveredId === recordId) return;
        if (this.hoveredId && this.markers[this.hoveredId]) {
            this.markers[this.hoveredId].group.scale.setScalar(1);
        }
        this.hoveredId = recordId;
        if (recordId && this.markers[recordId]) {
            this.markers[recordId].group.scale.setScalar(1.35);
        }
    }
    clearHover() { this.setHover(null); }

    // إبراز كل الدبابيس (زر العدسة)
    setHighlight(on) { this.highlight = !!on; this._applyHighlight(); }
    _applyHighlight() {
        const s = this.highlight ? 1.7 : 1;
        const o = this.highlight ? 0.5 : 0.25;
        for (const id in this.markers) {
            this.markers[id].halo.scale.setScalar(s);
            this.markers[id].halo.material.opacity = o;
        }
    }
}