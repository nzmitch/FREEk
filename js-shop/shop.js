// @mkblvcreates
// @romefortune
// @mitch.js
// © 2020




//==============================================================================
//==============================================================================
var isMobile
var canvas;
var container;
var renderer;
var fov;
var aspect;
var near;
var far;
var scene;
var light;
var loadingManager;
var loader;
var object;
var root;
var tween;
var width;
var height;
var needResize;
var mixers = [];

//-----------------------------------------------------
//Is mobile
isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
if (isMobile) {
    document.body.className = 'mobile';
    console.log('IS MOBILE')
}

init();

function init() {

    canvas = document.querySelector('#c');
    fov = 45;
    aspect = 2;
    near = 0.1;
    far = 5;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(200, 0, 0);

    renderer = new THREE.WebGLRenderer({
        alpha: true,
        canvas,
        antialiasing: false,
        preserveDrawingBuffer: false,
        powerPreference: 'low-power',
        
    });
    
    //-----------------------------------------------------
    //Controls
    controls = new THREE.OrbitControls(camera);
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.minPolarAngle = Math.PI * 0.495;
    if (isMobile) {
        camera.position.set(3.33, 8, 10);
        controls.minDistance = 3.33;
        controls.maxDistance = 3.33;
    } else {
        camera.position.set(2.75, 8, 10);
        controls.minDistance = 2.75;
        controls.maxDistance = 2.75;
    };
    controls.target.set(0, 8, 0);
    controls.update();

    scene = new THREE.Scene();

    light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 200, 0);
    scene.add(light);

    //-----------------------------------------------------
    //Loader
    loadingManager = new THREE.LoadingManager(() => {

        loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');
        // optional: remove loader from DOM via event listener
        loadingScreen.addEventListener('transitionend', onTransitionEnd);
    });

    // 3D shoe model
    loader = new THREE.FBXLoader(loadingManager);
    object = null;
    loader.load(
        "js/FREEk_AF1.fbx",
        function (object) {
            object.mixer = new THREE.AnimationMixer(object);
            mixers.push(object.mixer);

            object.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = false;
                    child.receiveShadow = false;
                }
            });
            object.position.x += 0;
            object.position.y += 7.8;
            object.position.z += 0;
            object.rotation.y = -1;
            scene.add(object);
            //-----------------------------------------------------
            //Hover animation
            tween = new TWEEN.Tween(object.position).to({
                x: 0,
                y: 7.75,
                z: 0
            }, 4000).start();
            tween.easing(TWEEN.Easing.Sinusoidal.InOut);
            tween.repeat(Infinity);
            tween.yoyo(true);
        }
    );

    //-----------------------------------------------------
    //Renderer
    function resizeRendererToDisplaySize(renderer) {
        canvas = renderer.domElement;
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function render() {
        if (resizeRendererToDisplaySize(renderer)) {
            canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        renderer.render(scene, camera);
        renderer.setClearColor(0x000000, 0);
        requestAnimationFrame(render);
        TWEEN.update();
    }
    requestAnimationFrame(render);
}
