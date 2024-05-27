var createScene = function () {
    var scene = new BABYLON.Scene(engine);
  // 定义四个不同的摄像机
    var camera1 = new BABYLON.ArcRotateCamera("Camera1", 0, 1.4, 4.5, new BABYLON.Vector3(0, 0, 0), scene);
    var camera2 = new BABYLON.ArcRotateCamera("Camera2", 1, 1.4, 10, new BABYLON.Vector3(0, 0, 0), scene);
    var camera3 = new BABYLON.ArcRotateCamera("Camera3", 2, 1.4, 10, new BABYLON.Vector3(0, 0, 0), scene);
    var camera4 = new BABYLON.ArcRotateCamera("Camera4", 3, 1.4, 10, new BABYLON.Vector3(0, 0, 0), scene);
   scene.activeCamera = camera1;
    camera1.speed=1.05;
    // camera1.fov=1;
    camera1.setTarget(BABYLON.Vector3.Zero());
    camera1.attachControl(canvas, true);

    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    // 创建切换摄像机的按钮
    var switchCameraButton = BABYLON.GUI.Button.CreateSimpleButton("switchCameraButton", "Switch Camera");
    switchCameraButton.width = "150px";
    switchCameraButton.height = "40px";
    switchCameraButton.color = "white";
    switchCameraButton.cornerRadius = 20;
    switchCameraButton.background = "black";
    switchCameraButton.top = "-40%"; // 调整位置
    var currentCameraIndex = 0;
    var cameras = [camera1, camera2, camera3, camera4];
    switchCameraButton.onPointerUpObservable.add(function () {
        currentCameraIndex = (currentCameraIndex + 1) % cameras.length;
        scene.activeCamera.detachControl(canvas);
        scene.activeCamera = cameras[currentCameraIndex];
        scene.activeCamera.attachControl(canvas, true);
    });
    advancedTexture.addControl(switchCameraButton);

       // 初始环境贴图
    var currentEnvironmentIndex = 0;
    var environmentTextures = [
        "/asset/PorscheCar//ENV/Env_Studiolight_RED.env",
        "/asset/PorscheCar/env/environment (97).env",
        "/asset/PorscheCar/env/environment (98).env",
         "/asset/PorscheCar/env/environment (100).env",
          "/asset/PorscheCar/env/environment (101).env",

    ];
    var currentEnvironmentTexture = new BABYLON.CubeTexture(environmentTextures[currentEnvironmentIndex], scene);
    scene.environmentTexture = currentEnvironmentTexture;
    scene.createDefaultSkybox(currentEnvironmentTexture, true, 1000);

    // scene.postProcessesEnabled = false;
    // 启用 Bloom 效果
    var bloomPipeline = new BABYLON.DefaultRenderingPipeline(
        "bloom",  // 渲染管道的名称
        true,     // 开启镜头透镜污渍效果
        scene,
        cameras  // 你的相机数组
    );

    bloomPipeline.imageProcessingEnabled=false;
    bloomPipeline.bloomEnabled = true;
    bloomPipeline.bloomThreshold = 0.8; 

    var meshName = "PorscheCar_BlackInoir.glb";
    var meshRooturl = "/asset/PorscheCar/" ;

    var materialName_carpaint = "NM_CarPaint";
    var materialName_carpaintFilePath = "/asset/PorscheCar/" + materialName_carpaint + ".json";
    var materialName_WindShield = "NM_WindShield";
    var materialName_WindShieldFilePath = "/asset/PorscheCar/" + materialName_WindShield + ".json";
    var materialName_whitelight_mat = "NM_WhiteLight";
    var materialName_whitelight_matFilePath = "/asset/PorscheCar/" + materialName_whitelight_mat + ".json";
    var materialName_redlight_mat = "NM_RedGlass";
    var materialName_redlight_matFilePath = "/asset/PorscheCar/" + materialName_redlight_mat + ".json";
    
    
    
    var SM_W_Shell05, SM_W_DoorShell_LF_Door, SM_W_DoorShell_LB_Door, 
        SM_W_trunk_Trunk_Door, SM_W_DoorShell_RF_Door, SM_W_DoorShell_RB_Door,
        SM_W_Glass05, SM_W_LF_Door_Glass, SM_W_LB_Door_Glass,
        SM_W_RF_Door_Glass, SM_W_RB_Door_Glass, SM_W_Windshield_Glass,
        SM_W_Acces_Door, SM_W_Trunk_Glass, SM_W_Glass07, SM_W_Glass_02,
        SM_WhiteLight_LF, SM_WhiteLight_RF
    
     BABYLON.SceneLoader.ImportMesh(
           "", 
           meshRooturl, 
           meshName, 
           this.scene,
            (meshes) => {
                 SM_W_Shell05 = scene.getMeshByName("SM_W_Shell05");
                 SM_W_DoorShell_LF_Door = scene.getMeshByName("SM_W_DoorShell_LF_Door");
                 SM_W_DoorShell_LB_Door = scene.getMeshByName("SM_W_DoorShell_LB_Door");
                 SM_W_trunk_Trunk_Door = scene.getMeshByName("SM_W_trunk_Trunk_Door");
                 SM_W_DoorShell_RF_Door = scene.getMeshByName("SM_W_DoorShell_RF_Door");
                 SM_W_DoorShell_RB_Door = scene.getMeshByName("SM_W_DoorShell_RB_Door");
                 SM_W_Glass05 = scene.getMeshByName("SM_W_Glass05");
                 SM_W_LF_Door_Glass = scene.getMeshByName("SM_W_LF_Door_Glass");
                 SM_W_LB_Door_Glass = scene.getMeshByName("SM_W_LB_Door_Glass");
                 SM_W_RF_Door_Glass = scene.getMeshByName("SM_W_RF_Door_Glass");
                 SM_W_RB_Door_Glass = scene.getMeshByName("SM_W_RB_Door_Glass");
                 SM_W_Windshield_Glass = scene.getMeshByName("SM_W_Windshield_Glass");
                 SM_W_Acces_Door = scene.getMeshByName("SM_W_Acces_Door");
                 SM_W_Trunk_Glass = scene.getMeshByName("SM_W_Trunk_Glass");
                 SM_W_Glass07 = scene.getMeshByName("SM_W_Glass07");
                 SM_W_Glass_02 = scene.getMeshByName("SM_W_Glass_02");
                 SM_WhiteLight_LF = scene.getMeshByName("SM_WhiteLight_LF");
                 SM_WhiteLight_RF = scene.getMeshByName("SM_WhiteLight_RF");
                 Trunk_Door = scene.getMeshByName("Trunk_Door");
                 SM_W_Other_bake_primitive1=scene.getMeshByName("SM_W_Other_bake_primitive1");
                 SM_W_HeadLightGlass=scene.getMeshByName("SM_W_HeadLightGlass");
                SM_W_Other_bake_primitive0=scene.getMeshByName("SM_W_Other_bake_primitive0");
                SM_RedLight=scene.getMeshByName("SM_RedLight");

                 console.log("Animation Groups:", scene.animationGroups);
                scene.animationGroups.forEach(function(animationGroup) {
                console.log("Animation Group Name:", animationGroup.name);
                // 这里可以添加更多的日志，以帮助您了解每个动画组的细节
                  });
                var closeTrunkDoorAnimation = scene.getAnimationGroupByName("Close_Trunk_Door");
                if (closeTrunkDoorAnimation) {
                    // 停止动画组
                    closeTrunkDoorAnimation.stop();
                }
                //车漆
                BABYLON.NodeMaterial.ParseFromFileAsync(
                    materialName_carpaint,
                    materialName_carpaintFilePath,
                    scene).then((carpaint_mat) => {
                        SM_W_Shell05.material = carpaint_mat;
                        SM_W_DoorShell_LF_Door.material = carpaint_mat;
                        SM_W_DoorShell_LB_Door.material = carpaint_mat;
                        SM_W_trunk_Trunk_Door.material = carpaint_mat;
                        SM_W_DoorShell_RF_Door.material = carpaint_mat;
                        SM_W_DoorShell_RB_Door.material = carpaint_mat;
                    });
                //车窗
                BABYLON.NodeMaterial.ParseFromFileAsync(
                    materialName_WindShield,
                    materialName_WindShieldFilePath,
                    scene).then((windshield_mat) => {
                        SM_W_Glass_02.material = windshield_mat;
                        SM_W_LF_Door_Glass.material = windshield_mat;
                        SM_W_LB_Door_Glass.material = windshield_mat;
                        SM_W_RF_Door_Glass.material = windshield_mat;
                        SM_W_RB_Door_Glass.material = windshield_mat;
                        SM_W_Windshield_Glass.material = windshield_mat;
                        SM_W_Acces_Door.material = windshield_mat;
                        SM_W_Trunk_Glass.material = windshield_mat;
                        SM_W_HeadLightGlass.material = windshield_mat;
                    });
                //
                BABYLON.NodeMaterial.ParseFromFileAsync(
                "NM_CarPaint_clear",
                "/asset/PorscheCar/NM_WindShield.json",
                scene);
                //尾灯
                BABYLON.NodeMaterial.ParseFromFileAsync(
                     "NM_RedLightlamp",
                    "/asset/PorscheCar/" + "NM_RedLightlamp" + ".json",
                    scene).then((redlight_mat) => {
                        SM_W_Other_bake_primitive1.material = redlight_mat;
                        SM_RedLight.material = redlight_mat;
                });
                //尾灯玻璃
                   BABYLON.NodeMaterial.ParseFromFileAsync(
                   "NM_RedGlass",
                    "/asset/PorscheCar/" + "NM_RedGlass" + ".json",
                    scene).then((redglass_mat) => {
                        
                        SM_W_Glass07.material = redglass_mat;
                        SM_W_Glass05.material = redglass_mat;
                });
                //头灯
                BABYLON.NodeMaterial.ParseFromFileAsync(
                     "NM_HeadLightLamp",
                    "/asset/PorscheCar/" + "NM_HeadLightLamp" + ".json",
                    scene).then((redlight_mat) => {
                        SM_W_Other_bake_primitive0.material = redlight_mat;
                });
                //头灯炫光面片
                BABYLON.NodeMaterial.ParseFromFileAsync(
                     "NM_WhiteLight",
                    "/asset/PorscheCar/" + "NM_WhiteLight" + ".json",
                    scene).then((redlight_mat) => {
                        SM_WhiteLight_RF.material = redlight_mat;
                        SM_WhiteLight_LF.material = redlight_mat;
                });

             

            }
        );

    // 创建 GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    
    // 创建按钮
    var button = BABYLON.GUI.Button.CreateSimpleButton("button", "Change Environment");
    button.width = "150px";
    button.height = "40px";
    button.color = "white";
    button.cornerRadius = 20;
    button.background = "black";

    // 设置按钮位置，将按钮向下移动
    button.top = "45%"; // 可以根据需要调整百分比值

    button.onPointerUpObservable.add(function () {
        // 切换环境贴图
        currentEnvironmentIndex = (currentEnvironmentIndex + 1) % environmentTextures.length;
        currentEnvironmentTexture.dispose(); // 释放当前环境贴图资源
        currentEnvironmentTexture = new BABYLON.CubeTexture(environmentTextures[currentEnvironmentIndex], scene);
        scene.environmentTexture = currentEnvironmentTexture;
        scene.createDefaultSkybox(currentEnvironmentTexture, true, 1000);
    });

    // 将按钮添加到 GUI
    advancedTexture.addControl(button);
    
    var carPaintMaterials = [
    "/asset/PorscheCar/NM_CarPaint.json",
    "/asset/PorscheCar/NM_CarPaint_Clear.json",
    "/asset/PorscheCar/NM_CarPaint_ClearBlue.json",
];

    var currentCarPaintIndex = 0;
    // 创建切换车漆材质的按钮
    var changeCarPaintButton = BABYLON.GUI.Button.CreateSimpleButton("changeCarPaintButton", "Change Car Paint");
    changeCarPaintButton.width = "150px";
    changeCarPaintButton.height = "40px";
    changeCarPaintButton.color = "white";
    changeCarPaintButton.cornerRadius = 20;
    changeCarPaintButton.background = "black";
    changeCarPaintButton.top = "40%";
    // 记录当前车漆材质索引

   changeCarPaintButton.onPointerUpObservable.add(function () 
    {
    currentCarPaintIndex = (currentCarPaintIndex + 1) % carPaintMaterials.length;
    var newCarPaintMaterialPath = carPaintMaterials[currentCarPaintIndex];
    BABYLON.NodeMaterial.ParseFromFileAsync(
        "newCarPaintMaterial", 
        newCarPaintMaterialPath,
        scene,
    ).then((newCarPaintMaterial) => {
        // 将新材质应用到车身各个部位
        SM_W_Shell05.material  = newCarPaintMaterial;
        SM_W_DoorShell_LF_Door.material = newCarPaintMaterial;
        SM_W_DoorShell_LB_Door.material = newCarPaintMaterial;
        SM_W_trunk_Trunk_Door.material = newCarPaintMaterial;
        SM_W_DoorShell_RF_Door.material = newCarPaintMaterial;
        SM_W_DoorShell_RB_Door.material = newCarPaintMaterial;
        });
    });
    advancedTexture.addControl(changeCarPaintButton); 


    
    return scene;
};
