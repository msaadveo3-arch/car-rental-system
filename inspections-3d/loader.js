import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class ModelLoader {
    constructor(scene) {
        this.scene = scene;
        this.loader = new GLTFLoader();
        this.carModel = null;
    }

    loadModel(url) {
        return new Promise((resolve, reject) => {
            this.loader.load(
                url,
                (gltf) => {
                    this.carModel = gltf.scene;
                    this.carModel.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    this.scene.add(this.carModel);
                    resolve(this.carModel);
                },
                undefined,
                (error) => reject(error)
            );
        });
    }

    getCarModel() { return this.carModel; }
}