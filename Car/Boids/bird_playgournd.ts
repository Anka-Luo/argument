var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    let camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 0, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(0, 0, -20));
    camera.attachControl(canvas, true);
    let skyLight = new BABYLON.HemisphericLight("sky", new BABYLON.Vector3(0, 1.0, 0), scene);
    skyLight.intensity = 1.0;

    //
    var birds = [];
    var meshName = "SM_CownFish_lowpoly100.glb";
    var meshRooturl = "/asset/Boids/" ;
    var materialName = "NM_Fish";
    var materialFilePath = "/asset/Boids/" + materialName + ".json";
    var meshScale=0.5;
    
    BABYLON.NodeMaterial.ParseFromFileAsync(materialName, materialFilePath, scene).then(birdmaterial => {
        BABYLON.SceneLoader.ImportMeshAsync("", meshRooturl, meshName, this.scene).then((result) => {
            var mesh_01 = result.meshes[1]; 
            mesh_01.scaling = new BABYLON.Vector3(meshScale, meshScale, meshScale);
            //视模型情况开启backFaceCulling
            birdmaterial.backFaceCulling = false;
            mesh_01.material = birdmaterial;
            mesh_01.setEnabled(false);
            const birdquantity = 100;
            for (var i = 0; i < birdquantity; i++) {
                // 创建每只生物的实例
                var bird = mesh_01.createInstance("bird" + i);
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

    var t = 0;
    var rotationQuaternion = new BABYLON.Quaternion();
    scene.registerAfterRender(function () {
        t += 0.005;

        for (var i = 0; i < birds.length; i++) {
            var bird = birds[i];
            
            // bird move 
            var position_origin = bird.position.clone();
            var xspeed = 0.05;
            var yspeed = 0.5;
            var zspeed = 0.2;
            bird.position.x += 0.3 * Math.sin(Math.PI * (t + i * xspeed));
            bird.position.y += 0.05 * Math.cos(Math.PI * (t + i * yspeed));
            bird.position.z += 0.3 * Math.sin(Math.PI * (t + i * zspeed));

            var velocity = bird.position.subtract(position_origin);

            //四元数旋转
            rotationQuaternion = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, -Math.atan2(velocity.z, velocity.x) );
            bird.rotationQuaternion = rotationQuaternion;

            // Ausrichtung 速度一致性
            var alignmentVector = new BABYLON.Vector3();
            var alignmentCount = 0;
            for (var j = 0; j < birds.length; j++) {
                if (i !== j) {
                    var otherBird = birds[j];
                    var distance = bird.position.subtract(otherBird.position).length();
                    if (distance < 1) { 
                        alignmentVector = alignmentVector.add(otherBird.getDirection(BABYLON.Axis.Z));
                        alignmentCount++;
                    }
                }
            }
            if (alignmentCount > 0) {
                alignmentVector = alignmentVector.scale(1 / alignmentCount);
            }
        
            // Zusammenhalt 凝聚行为
            var cohesionVector = new BABYLON.Vector3();
            var cohesionCount = 0;
            for (var j = 0; j < birds.length; j++) {
                if (i !== j) {
                    var otherBird = birds[j];
                    var distance = bird.position.subtract(otherBird.position).length();
                    if (distance < 2) { // 2
                        cohesionVector = cohesionVector.add(otherBird.position);
                        cohesionCount++;
                    }
                }
            }
            if (cohesionCount > 0) {
                cohesionVector = cohesionVector.scale(1 / cohesionCount);
                bird.position = bird.position.add(cohesionVector.subtract(bird.position).scale(0.05));
            }

            // Trennung 分离行为
            var separationVector = new BABYLON.Vector3();
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
};
