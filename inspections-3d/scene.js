import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class SceneSetup {
    constructor(canvas) {
        this.canvas = canvas;

        this.scene = new THREE.Scene();
        // بدون background صلب -> تظهر خلفية CSS (استوديو داكن)

        this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 1000);
        this.camera.position.set(4.6, 2.5, 5.6);

        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.05;

        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08;
        this.controls.minDistance = 2.2;
        this.controls.maxDistance = 14;
        this.controls.maxPolarAngle = Math.PI / 2 - 0.04;
        this.controls.target.set(0, 0.7, 0);

        // ---------- حالة الدوران التلقائي (مصدر الحقيقة هنا) ----------
        this._autoWanted = true;          // نيّة المستخدم
        this.controls.autoRotate = true;  // مطابق للزر الأزرق النشط في التصميم
        this.controls.autoRotateSpeed = 0.9; // دوران أنيق بطيء غير مزعج

        // عند أي تفاعل يدوي (سحب / تكبير / تحريك): أوقف الدوران فوراً
        // ولا أُعيده تلقائياً -> هذا يحل مشكلة "تدور دون توقف"
        this.controls.addEventListener('start', () => {
            this.controls.autoRotate = false;
            this._autoWanted = false;
            if (typeof this.onAutoRotateChange === 'function') {
                this.onAutoRotateChange(false); // يُزامن زر app.js
            }
        });
        // ملاحظة: عند 'end' لا نفعل شيئاً -> تبقى متوقفة حتى يضغط المستخدم الزر

        // حفظ الوضع الافتراضي لزر Reset View
        this.initialCamPos = this.camera.position.clone();
        this.initialTarget = this.controls.target.clone();

        this.setupLights();
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    setupLights() {
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.65));

        const key = new THREE.DirectionalLight(0xffffff, 1.4);
        key.position.set(5, 9, 6);
        key.castShadow = true;
        key.shadow.mapSize.set(1024, 1024);
        this.scene.add(key);

        const fill = new THREE.DirectionalLight(0xbcd0ff, 0.45); // ضوء ملء بارد
        fill.position.set(-6, 3, -3);
        this.scene.add(fill);

        const rim = new THREE.DirectionalLight(0xffffff, 0.9);  // حافة لإبراز السيلويت
        rim.position.set(-1, 4, -8);
        this.scene.add(rim);
    }

    resize() {
        const w = this.canvas.clientWidth || window.innerWidth;
        const h = this.canvas.clientHeight || window.innerHeight;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h, false);
    }

    /* ---------- تحكم صريح بالدوران (يُستدعى من زر app.js) ---------- */
    setAutoRotate(on) {
        this._autoWanted = !!on;
        this.controls.autoRotate = this._autoWanted;
        if (typeof this.onAutoRotateChange === 'function') {
            this.onAutoRotateChange(this._autoWanted);
        }
    }
    toggleAutoRotate() { this.setAutoRotate(!this._autoWanted); }
    isAutoRotate() { return this._autoWanted; }

    /* ---------- أدوات شريط الأدوات ---------- */
    dolly(factor) {
        const offset = new THREE.Vector3().subVectors(this.camera.position, this.controls.target);
        const dist = THREE.MathUtils.clamp(offset.length() * factor, this.controls.minDistance, this.controls.maxDistance);
        offset.setLength(dist);
        this.camera.position.copy(this.controls.target).add(offset);
        this.controls.update();
    }
    zoomIn()  { this.dolly(0.82); }
    zoomOut() { this.dolly(1 / 0.82); }

    resetView() {
        this.camera.position.copy(this.initialCamPos);
        this.controls.target.copy(this.initialTarget);
        this.controls.update();
    }

    fitToView(object) {
        if (!object) return;
        const box = new THREE.Box3().setFromObject(object);
        const sphere = box.getBoundingSphere(new THREE.Sphere());
        const fov = this.camera.fov * Math.PI / 180;
        const dist = THREE.MathUtils.clamp((sphere.radius / Math.sin(fov / 2)) * 1.25, this.controls.minDistance, this.controls.maxDistance);
        const dir = new THREE.Vector3().subVectors(this.camera.position, this.controls.target).normalize();
        this.controls.target.copy(sphere.center);
        this.camera.position.copy(sphere.center).add(dir.multiplyScalar(dist));
        this.controls.update();
    }

    toggleWireframe(object) {
        if (!object) return;
        object.traverse((c) => {
            if (c.isMesh && c.material) {
                const mats = Array.isArray(c.material) ? c.material : [c.material];
                mats.forEach(m => { m.wireframe = !m.wireframe; });
            }
        });
    }

    getScene()    { return this.scene; }
    getCamera()   { return this.camera; }
    getRenderer() { return this.renderer; }
    getControls() { return this.controls; }
}