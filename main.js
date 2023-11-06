var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
  engine.runRenderLoop(function () {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
  });
};

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () {
  return new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false,
  });
};
var createScene = function () {
  // This creates a basic Babylon Scene object (non-mesh)
  var scene = new BABYLON.Scene(engine);

  // This creates and positions a free camera (non-mesh)
  camera = new BABYLON.ArcRotateCamera(
    "ArcRotateCamera",
    0,
    0,
    0,
    new BABYLON.Vector3.Zero(),
    scene
  );
  camera.setTarget(new BABYLON.Vector3(1.286, 0.493, -0.540));
  // camera general setting
  camera.minZ = CAMERA_NEAR_PLANE_VALUE; // camera Near Plane set
  camera.maxZ = CAMERA_FAR_PLANE_VALUE; // camera Far Plane set
  camera.inertia = CAMERA_INERTIA; // camera inertia
  camera.fov = FIELD_OF_VIEW;

  // set camera control
  // camera.panningSensibility = CAMERA_SENSIBILITY;
  // camera.pinchDeltaPercentage = CAMERA_PINCH_DELTA_PERCENTAGE;
  // camera.wheelDeltaPercentage = CAMERA_WHEEL_DELTA_PERCENTAGE;
  camera.speed = CAMERA_SPEED;

  // set camera beta limits
  camera.lowerBetaLimit = CAMERA_LOWER_BETA_LIMIT;
  camera.upperBetaLimit = CAMERA_UPPER_BETA_LIMIT;

  // Positions the camera overwriting alpha, beta, radius
  cameraDefaultPosition(camera, scene);

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  meshLoad(scene);

  // scene.debugLayer.show();
  return scene;
};

function meshLoad(scene) {
  // red bike RR_310_Red loaded
  BABYLON.SceneLoader.ImportMesh(
    "",
    "",
    "cabin_with_occupant.stl",
    scene,
    function (meshes) {
      matte_blue_bike_meshes = meshes;
      mesh = meshes[0];

      //add highlight layer
      highlightLayer = new BABYLON.HighlightLayer("h1", scene, {
        renderingGroupId: 0,
      });

      meshes.forEach((mesh) => {
        highlightLayer.addMesh(mesh, BABYLON.Color3.White());
      });

      highlightLayer.innerGlow = 0.5; // Adjust as needed
      highlightLayer.outerGlow = 0.5; // Adjust as needed
    },
    function (event) {}
  );
}

function cameraDefaultPosition(camera, scene, aspectRatio = null) {
  camera.lowerRadiusLimit = CAMERA_DESKTOP_LOWER_RADIUS_LIMIT;
  camera.upperRadiusLimit = CAMERA_DESKTOP_UPPER_RADIUS_LIMIT;

  camera.setPosition(
    new BABYLON.Vector3(0, 0, CAMERA_DESKTOP_SCALLING_Z_VALUE)
  );

  // camera default alpha value
  camera.alpha = CAMERA_DEFAULT_ALPHA_VALUE;
}

window.initFunction = async function () {
  var asyncEngineCreation = async function () {
    try {
      return createDefaultEngine();
    } catch (e) {
      console.log(
        "the available createEngine function failed. Creating the default engine instead"
      );
      return createDefaultEngine();
    }
  };

  window.engine = await asyncEngineCreation();
  if (!engine) throw "engine should not be null.";
  startRenderLoop(engine, canvas);
  window.scene = createScene();
};
initFunction().then(() => {
  sceneToRender = scene;
});

// Resize
window.addEventListener("resize", function () {
  engine.resize();
});
