/* eslint-disable no-var */
// import "babylon-mmd/esm/Loader/Optimized/bpmxLoader";
import "babylon-mmd/esm/Runtime/Animation/mmdRuntimeCameraAnimation";
import "babylon-mmd/esm/Runtime/Animation/mmdRuntimeModelAnimation";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/core/Rendering/geometryBufferRendererSceneComponent";

import { type Engine, type Scene, SceneLoader } from "@babylonjs/core";
import * as BABYLON from "@babylonjs/core";
import { GLTFFileLoader } from "@babylonjs/loaders";

/**
* 场景构建器类，用于创建和配置Babylon.js场景以及加载MMD模型和相关资源。
* /
* @export
* @class SceneBuilder
* @implements {ISceneBuilder} 异步构建场景的接口
*/
// import type { MmdStandardMaterialBuilder } from "babylon-mmd/esm/Loader/mmdStandardMaterialBuilder";
// import { MmdPlayerControl } from "babylon-mmd/esm/Runtime/Util/mmdPlayerControl";
import type { ISceneBuilder } from "./baseRuntime";
export class SceneBuilder implements ISceneBuilder {
    public async build(_canvas: HTMLCanvasElement, engine: Engine): Promise<Scene> {
        const scene = new BABYLON.Scene(engine);
        // const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);
        const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene);
        sphere.position.x = 15;
        sphere.outlineColor = BABYLON.Color3.Red();
        const sphere2 = BABYLON.MeshBuilder.CreateSphere("sphere2", { diameter: 2 }, scene);
        sphere2.position.x = -15;
        // ground.position.y = -1;
        // 0ground.outlineColor = BABYLON.Color3.Red();

        const camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 35, new BABYLON.Vector3(0, 0, 0), scene);
        // camera.setPosition(new BABYLON.Vector3(0, 0, 35));
        camera.attachControl(_canvas, true);
        const skyLight = new BABYLON.HemisphericLight("sky", new BABYLON.Vector3(0, 1.0, 0), scene);
        skyLight.intensity = 1.0;
        SceneLoader.RegisterPlugin(new GLTFFileLoader());
        // const mmdMesh = await SceneLoader.ImportMeshAsync("", "src/Boids/", "SM_CownFish_lowpoly100.glb", scene)
        //     .then((result) => result.meshes[0] as BABYLON.Mesh);
        // mmdMesh.position.y = 1;
        //
        const birds: any[] = [];
        const meshName = "SM_CownFish_lowpoly100.glb";
        const meshRooturl = "src/Boids/";
        const materialName = "NM_Fish";
        const materialFilePath = "src/Boids/" + materialName + ".json";
        const meshScale = 0.5;
        // 异步加载模型
        BABYLON.NodeMaterial.ParseFromFileAsync(materialName, materialFilePath, scene).then(birdmaterial => {
            BABYLON.SceneLoader.ImportMeshAsync("", meshRooturl, meshName, scene).then((result) => {
                const mesh_01 = result.meshes[1] as BABYLON.Mesh;
                mesh_01.scaling = new BABYLON.Vector3(meshScale, meshScale, meshScale);
                //视模型情况开启backFaceCulling
                birdmaterial.backFaceCulling = false;
                mesh_01.material = birdmaterial;
                mesh_01.setEnabled(false);
                const birdquantity = 100;
                for (let i = 0; i < birdquantity; i++) {
                    // 创建每只生物的实例
                    const bird = mesh_01.createInstance("bird" + i);
                    bird.material = birdmaterial;
                    // 初始随机设置每只生物的位置
                    const xRandomvalue = 15;
                    const yRandomvalue = 5;
                    const zRandomvalue = 15;
                    bird.position = new BABYLON.Vector3(
                        Math.random() * xRandomvalue - 1, Math.random() * yRandomvalue - 5, Math.random() * zRandomvalue - 5
                    );
                    birds.push(bird);
                }
            });
        });

        let t = 0;
        let rotationQuaternion = new BABYLON.Quaternion();
        scene.registerAfterRender(function() {
            t += 0.005;

            for (let i = 0; i < birds.length; i++) {
                const bird = birds[i];

                // bird move
                const position_origin = bird.position.clone();
                const xspeed = 0.05;
                const yspeed = 0.5;
                const zspeed = 0.2;
                bird.position.x += 0.3 * Math.sin(Math.PI * (t + i * xspeed));
                bird.position.y += 0.05 * Math.cos(Math.PI * (t + i * yspeed));
                bird.position.z += 0.3 * Math.sin(Math.PI * (t + i * zspeed));

                const velocity = bird.position.subtract(position_origin);

                //四元数旋转
                rotationQuaternion = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, -Math.atan2(velocity.z, velocity.x));
                bird.rotationQuaternion = rotationQuaternion;

                // Ausrichtung 速度一致性
                let alignmentVector = new BABYLON.Vector3();
                let alignmentCount = 0;
                // eslint-disable-next-line no-var
                for (var j = 0; j < birds.length; j++) {
                    if (i !== j) {
                        var otherBird = birds[j];
                        var distance = bird.position.subtract(otherBird.position).length();
                        if (distance < 1) {
                            alignmentVector = alignmentVector.add(otherBird.getDirection(BABYLON.Axis.Z));
                            // eslint-disable-next-line no-plusplus
                            alignmentCount++;
                        }
                    }
                }
                if (alignmentCount > 0) {
                    alignmentVector = alignmentVector.scale(1 / alignmentCount);
                }

                // Zusammenhalt 凝聚行为
                let cohesionVector = new BABYLON.Vector3();
                let cohesionCount = 0;
                for (var j = 0; j < birds.length; j++) {
                    if (i !== j) {
                        var otherBird = birds[j];
                        var distance = bird.position.subtract(otherBird.position).length();
                        if (distance < 2) { // 2
                            cohesionVector = cohesionVector.add(otherBird.position);
                            // eslint-disable-next-line no-plusplus
                            cohesionCount++;
                        }
                    }
                }
                if (cohesionCount > 0) {
                    cohesionVector = cohesionVector.scale(1 / cohesionCount);
                    bird.position = bird.position.add(cohesionVector.subtract(bird.position).scale(0.05));
                }

                // Trennung 分离行为
                let separationVector = new BABYLON.Vector3();
                for (var j = 0; j < birds.length; j++) {
                    if (i !== j) {
                        var otherBird = birds[j];
                        var distance = bird.position.subtract(otherBird.position).length();
                        if (distance < 2) { // 1
                            separationVector = separationVector.add(bird.position.subtract(otherBird.position).normalize().scale(1 / distance));
                        }
                    }
                }
                bird.position = bird.position.add(separationVector.scale(0.02));
            }
        });
        return scene;
    }
}
