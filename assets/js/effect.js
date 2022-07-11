var camera, scene, renderer,
    geometry, material, mesh;

init();
animate();

function init() {

    clock = new THREE.Clock();
    const canvas = document.getElementById('c_effect');
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    // renderer.setClearColor(0x1d1a19, 1);
    window.addEventListener('resize', function () {
        renderer.setSize(this.innerWidth, this.innerHeight)
        camera.aspect = this.innerWidth / this.innerHeight
        camera.updateProjectionMatrix()
    })

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        return needResize;
    }

    function render() {
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
    scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight(0xffffdead);
    scene.add(ambientLight);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 800;
    scene.add(camera);

    geometry = new THREE.CubeGeometry(2, 2, 2);
    material = new THREE.MeshLambertMaterial({
        color: 0xaaa466,
        wireframe: false
    });
    mesh = new THREE.Mesh(geometry, material);
    //scene.add( mesh );
    cubeSineDriver = 0;

    THREE.ImageUtils.crossOrigin = ''; //Need this to pull in crossdomain images from AWS


    smokeTexture = THREE.ImageUtils.loadTexture('https://s3-us-west-2.amazonaws.com/s.cdpn.io/95637/Smoke-Element.png');
    smokeMaterial = new THREE.MeshLambertMaterial({
        color: 0x937268,
        opacity: 0.15,
        map: smokeTexture,
        transparent: true
    });
    smokeGeo = new THREE.PlaneGeometry(550, 550);
    smokeParticles = [];

    for (p = 0; p < 150; p++) {
        var particle = new THREE.Mesh(smokeGeo, smokeMaterial);
        particle.position.set(Math.random() * 700 - 350, Math.random() * 350 - 150, Math.random() * 600 - 100);
        particle.rotation.z = Math.random() * 360;
        scene.add(particle);
        smokeParticles.push(particle);
    }

    document.body.appendChild(renderer.domElement);

}

function animate() {

    // note: three.js includes requestAnimationFrame shim

    delta = clock.getDelta();
    requestAnimationFrame(animate);
    evolveSmoke();
    render();

}

function evolveSmoke() {
    var sp = smokeParticles.length;
    while (sp--) {
        smokeParticles[sp].rotation.z += (delta * 0.6);
    }
}

function render() {

    mesh.rotation.x += 0.05;
    mesh.rotation.y += 0.1;
    cubeSineDriver += .01;
    mesh.position.z = 100 + (Math.sin(cubeSineDriver) * 500);
    renderer.render(scene, camera);

}