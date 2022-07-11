// import { initLang, setTexts } from './lang.js'
import { lastLang } from './lang.js'
//* ===================================================================
//*                             Settings                               
//* ===================================================================
//- ----------------------------- html --------------------------------
pageNum = '06'
targetElem = '#canvas'
//- ----------------------------- model -------------------------------
modelFile = './assets/model/wg06/triceratops.glb'
modelScale = 0.75
modelPos = { x: 0, y: -1.40, z: 0 }
camInitPos = { x: 6, y: 0.5, z: -3 }
anyNum = 0
//* ===================================================================
//*                               Main                                 
//* ===================================================================
initialFn()
modelFn()
modelFn2()
clock = new THREE.Clock()
updateFn()
btnNodes = []
btnObjs = []
addBtnFn('01', '', '', { x: 6, y: 0, z: 1.5 }, 4) //뒷발
addBtnFn('02', '', '', { x: 6, y: 1, z: -0.5 }, 1) //이빨
addBtnFn('03', '', '', { x: 5, y: 0, z: 4 }, 2) //앞다리
addBtnFn('04', '', '', { x: 5, y: 0, z: -6 }, 3) //뒷발톱
//* ===================================================================
//*                               Core                                 
//* ===================================================================
//- --------------------------- initialFn -----------------------------
export function initialFn() {
    scene = new THREE.Scene()
    // scene.fog = new THREE.Fog( 0xFEFFE1, 2, 30 );
    camera = new THREE.PerspectiveCamera(50, canvasWidthFn() / canvasHeightFn(), 0.01, 5000)
    camera.position.set(camInitPos.x, camInitPos.y, camInitPos.z)
    camera.aspect = canvasWidthFn() / canvasHeightFn()
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setClearColor('#000AFF', 1.0)
    renderer.setPixelRatio(window.devicePixelRatio || 1)
    renderer.setSize(canvasWidthFn(), canvasHeightFn())
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.enabled = true
    renderer.shadowMapSoft = true
    domEvents = new THREEx.DomEvents(camera, renderer.domElement)
    renderer2d = new THREE.CSS2DRenderer()
    renderer2d.setSize(canvasWidthFn(), canvasHeightFn())
    renderer2d.domElement.style.position = 'absolute'
    renderer2d.domElement.style.top = '0px'
    renderer2d.domElement.style.zIndex = 9

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

    controls = new THREE.OrbitControls(camera, renderer.domElement)
    controls2d = new THREE.OrbitControls(camera, renderer2d.domElement)
    controls2d.minDistance = 5
    controls2d.maxDistance = 9
    controls2d.maxPolarAngle = Math.PI / 1.9
    controls2d.minPolarAngle = Math.PI / 2.2
    controls2d.enablePan = false
    controls2d.enableZoom = true

    hLight = new THREE.HemisphereLight('#b1b1d0')
    scene.add(hLight)

    dLight = new THREE.DirectionalLight('#b1b1d0', 4)
    dLight.position.set(1.1, 1.8, -0.9);
    dLight.castShadow = true
    scene.add(dLight)

    dLight.shadow.camera.top = 10
    dLight.shadow.camera.bottom = -10
    dLight.shadow.camera.left = -10
    dLight.shadow.camera.right = 10
    dLight.shadow.bias = 0.000001
    dLight.shadow.radius = 2
    dLight.shadow.needsUpdate = true
    dLight.shadow.mapSize.width = 512
    dLight.shadow.mapSize.height = 512
    dLight.shadow.camera.far = 10


    dLight2 = new THREE.DirectionalLight('#b1b1d0', 1)
    dLight2.position.set(-1, -0.7, -2);
    scene.add(dLight2)

    document.querySelector(targetElem).appendChild(renderer.domElement)
    document.querySelector(targetElem).appendChild(renderer2d.domElement)
    window.addEventListener('resize', () => {
        renderer.setSize(canvasWidthFn(), canvasHeightFn())
        renderer2d.setSize(canvasWidthFn(), canvasHeightFn())
        camera.aspect = canvasWidthFn() / canvasHeightFn()
        camera.updateProjectionMatrix()
        resizeFn()
    })
    resizeFn()
}
//- ---------------------------- modelFn ------------------------------
export function modelFn() {
    modelLoader = new THREE.GLTFLoader()
    modelLoader.load(modelFile, (gltf) => {
        modelObj = gltf.scene
        modelObj.name = 'modelObj'
        modelObj.scale.set(modelScale, modelScale, modelScale)
        modelObj.position.set(modelPos.x, modelPos.y, modelPos.z)
        modelObj.rotation.y = Math.PI / 2
        modelObj.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
                child.material.roughness = 0.9;
                child.material.transparent = true
                child.material.needsUpdate = true;

            }
        })
        scene.add(modelObj)
        mixer = new THREE.AnimationMixer(modelObj)
        animates = []
        gltf.animations.forEach(clip => {
            const animate = mixer.clipAction(clip)
            animate.clampWhenFinished = true
            animate.loop = -1 //THREE.LoopOnce
            animates.push(animate)
        })
        animatePlay(anyNum)
        let spinner = document.querySelector('.spinner')
        let canvasEl = document.querySelector('#canvas')
        gsap.to(spinner, {
            opacity: 0, duration: 1.3, ease: 'Power0.easeNone',
            onComplete: () => spinner.style.display = 'none'
        })
        gsap.to(canvasEl, { opacity: 1, duration: 1.5, ease: 'Power0.easeNone', })

    })

}
export function modelFn2() {
    textureLoader = new THREE.TextureLoader()

    const mapHeight = new THREE.TextureLoader().load("assets/img/back06/ny.jpg");
    mapHeight.wrapS = mapHeight.wrapT = THREE.RepeatWrapping;
    mapHeight.repeat.set(3, 3);
    mapHeight.anisotropy = 5;

    const bumpHeight = new THREE.TextureLoader().load("assets/img/back06/bump.jpg");
    bumpHeight.wrapS = bumpHeight.wrapT = THREE.RepeatWrapping;
    bumpHeight.repeat.set(3, 3);
    bumpHeight.anisotropy = 5;

    materialArray = [];

    px = new THREE.TextureLoader().load("assets/img/back06/px.jpg");
    nx = new THREE.TextureLoader().load("assets/img/back06/nx.jpg");
    py = new THREE.TextureLoader().load("assets/img/back06/py.jpg");
    // ny = new THREE.TextureLoader().load("assets/img/back08/ny.jpg");
    pz = new THREE.TextureLoader().load("assets/img/back06/pz.jpg");
    nz = new THREE.TextureLoader().load("assets/img/back06/nz.jpg");

    materialArray.push(new THREE.MeshBasicMaterial({ map: px }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: nx }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: py }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: ny }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: pz }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: nz }));

    for (let i = 0; i < 6; i++)
        materialArray[i].side = THREE.BackSide;

    skyboxgeo = new THREE.BoxGeometry(20, 20, 20);
    // skybox.name = 'skybox'
    skybox = new THREE.Mesh(skyboxgeo, materialArray);
    skybox.position.y = 0;

    skybox.receiveShadow = true;
    scene.add(skybox)

    floor = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(16, 16, 10, 10),
        // new THREE.MeshBasicMaterial({
        new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
            shininess: 0,
            reflectivity: 0,
            map: mapHeight, //PNG with text and symbols
            displacementMap: mapHeight, //same as map
            displacementScale: 3,
            // displacementBias: 0,
            // normalMap: bumpHeight,
            // normalScale: new THREE.Vector2( 3, -3 ),
            bumpMap: bumpHeight,
            bumpScale: 0.03
        })
    )

    floor.rotation.x = Math.PI / 2
    floor.position.y = -1.1
    floor.receiveShadow = true;
    scene.add(floor)
}
//- --------------------------- updateFn ------------------------------
export function updateFn() {
    camera.lookAt(0, 0, 0)
    requestAnimationFrame(updateFn)
    const delta = clock.getDelta()
    if (mixer) mixer.update(delta)
    renderer.render(scene, camera)
    renderer2d.render(scene, camera)
}
//* ===================================================================
//*                              Buttons                               
//* ===================================================================
function addBtnFn(btnNum, tippyTitle, btnPos, camMovePos, aniIndex) {
    btnHtml = `<a href="javascript:;" id="wgBtn${btnNum}" class="wgBtn"></a>` //<!--<span class="material-icons wgBtnIcon">add_circle</span>-->
    btnNode = document.createElement('div')
    btnNode.innerHTML = btnHtml
    btnNode = btnNode.children[0]
    // document.body.appendChild(btnNode)
    // document.querySelector('.btn_navi').appendChild(btnNode)
    // btnObj = new THREE.CSS2DObject(btnNode)
    // btnObj.name = 'wgBtn' + btnNum
    // btnObj.position.set(btnPos.x, btnPos.y, btnPos.z)
    // btnNodes.push(btnNode)
    // btnObjs.push(btnObj)

    // scene.add(btnObj)


    tippy(`#wgBtn${btnNum}`, {
        content: `<span class="tooltipTitle" id="wg${pageNum}BtnT${btnNum}">${tippyTitle}</span>`,
        allowHTML: true, arrow: true, animation: 'animate01',
        delay: [0, 100], duration: 500, placement: 'right-start',
        onMount(instance) {
            // setTexts(initLang())
            // let hash = window.parent.location.hash.replace('#', '')
            // if (hash) setTexts(hash)
            // else setTexts('en')
        }
    })

    btnNode.addEventListener('click', () => {
        // let screamWrap = window.parent.document.querySelectorAll(".scream-wrap");
        // gsap.to(screamWrap, {
        //     opacity: 0,
        //     visibility:"hidden",
        //     duration: 0,
        //     ease: 'Power3.ease',
        // })
        // animatePlay(aniIndex)
        // let tippyItems = document.querySelectorAll('[id*="tippy-"]')
        // for (let item of tippyItems) item.style.display = 'none'
        // for (let btnObj of btnObjs) scene.remove(btnObj)
        // gsap.to(camera.position, { x: camMovePos.x, y: camMovePos.y, z: camMovePos.z, duration: 1, ease: 'Power2.easeInOut', onComplete: () => { } })
        // gsap.to(modelObj.position, { y: '+=0.2', duration: 1, ease: 'Power1.easeOut', onComplete: () => { } })
        // let modal = document.querySelector(`#modal${btnNum}`)
        // modal.style.display = 'flex'
        // gsap.to(modal, {
        //     bottom: "2%", opacity: 1, duration: 1, ease: 'Power3.easeOut',
        //     onComplete: () => {
        //         let modalClose = modal.querySelector('.modalClose')
        //         modalClose.addEventListener('click', () => {
        //             animatePlay(anyNum)
        //             gsap.to(screamWrap, {
        //                 opacity:1,
        //                 visibility:"visible",
        //                 duration:0,
        //             })
        //             gsap.to(modal, {
        //                 bottom: "-100px", opacity: 0, duration: 1, ease: 'Power3.ease',
        //                 onComplete: () => { modal.style.display = 'none' }
        //             })

        //             gsap.to(modelObj.position, { y: '-=0.2', duration: 1, ease: 'Power1.easeOut', onComplete: () => { } })
        //             // audioModal.pause();
        //         })
        //     },
        // })

        const mainBtn = window.parent.document.querySelector('#wgBtn01');
        gsap.to(mainBtn, {
            visibility: 'hidden',
            duration: 0,
            onComplete: () => {
                let modalClose = window.parent.document.querySelector('.navi_close')
                modalClose.style.display = 'block'
                modalClose.addEventListener('click', () => {
                    mainBtn.style.visibility = 'visible';
                    modalClose.style.display = 'none';
                    animatePlay(0);


                    // animatePlay(anyNum)
                    // gsap.to(screamWrap, {
                    //     opacity:1,
                    //     visibility:"visible",
                    //     duration:0,
                    // })
                    // gsap.to(modal, {
                    //     bottom: "-100px", opacity: 0, duration: 1, ease: 'Power3.ease',
                    //     onComplete: () => { modal.style.display = 'none' }
                    // })
                    // gsap.to(camera.position, {
                    //     x: camInitPos.x, y: camInitPos.y, z: camInitPos.z, duration: 1, ease: 'Power2.easeInOut',
                    //     onComplete: () => {
                    //         for (let btnObj of btnObjs) scene.add(btnObj)
                    //         for (let item of tippyItems) item.style.display = 'block'
                    //     }
                    // })
                    // gsap.to(modelObj.position, { y: '-=0.2', duration: 1, ease: 'Power1.easeOut', onComplete: () => { } })
                    // // audioModal.pause();
                })
            },
        })

    })
}


//* ===================================================================
//*                             Functions                              
//* ===================================================================
function resizeFn() {
    if (parent.matchMedia('(orientation: landscape)').matches) {
        if (innerHeight < 300) camera.zoom = 1.5
        else if (innerHeight < 400) camera.zoom = 1.3
        else if (innerHeight < 500) camera.zoom = 1.3
        else if (innerHeight < 600) camera.zoom = 1.0
        else camera.zoom = 1
    }
    camera.updateProjectionMatrix()
}
//- -------------------------- animatePlay ----------------------------
function animatePlay(index) {
    for (let animate of animates) animate.stop()
    animates[index].play()
}
//- ------------------------- canvasWidthFn ---------------------------
function canvasWidthFn() {
    // return window.innerWidth
    return document.querySelector('.canvasWrap').clientWidth;
}

//- ------------------------ canvasHeightFn ---------------------------
function canvasHeightFn() {
    // return window.innerHeight
    return document.querySelector('.canvasWrap').clientHeight;
}
//- -------------------------- getOrientFn ----------------------------
function getOrientFn() {
    return window.matchMedia('(orientation: portrait)').matches
}
//- ---------------------------- turnOn -------------------------------
export function turnOn() {
    if (!scene.children.includes(hLight)) scene.add(hLight)
    if (!scene.children.includes(dLight)) scene.add(dLight)
    if (!scene.children.includes(btnObj)) scene.add(btnObj)
    if (!scene.children.includes(modelObj)) scene.add(modelObj)
    if (modelObj.children.length === 0) {
        modelFn()
    }
}
//- ---------------------------- turnOff ------------------------------
export function turnOff() {
    if (scene.children.includes(hLight)) scene.remove(hLight)
    if (scene.children.includes(dLight)) scene.remove(dLight)
    if (scene.children.includes(btnObj)) scene.remove(btnObj)
    if (scene.children.includes(modelObj)) scene.remove(modelObj)
    modelObj.remove.apply(modelObj, modelObj.children)
}
//* ===================================================================
//*                             Variables                              
//* ===================================================================
//- ---------------------------- setting ------------------------------
var targetElem, pageNum, anyNum
var modelFile, modelScale, modelPos, camInitPos
//- ---------------------------- initFn -------------------------------
var scene, camera, renderer, controls, controls2d, hLight, dLight, dLight2, renderer2d, domEvents
//- ---------------------------- modelFn ------------------------------
var modelLoader, mixer, modelObj, animates
//- ---------------------------- model2Fn ------------------------------
var skybox, skyboxgeo, textureLoader, materialArray, px, nx, py, ny, pz, nz, floor
//- --------------------------- updateFn ------------------------------
var clock
//- ----------------------------- btnFn -------------------------------
var btnHtml, btnNode, btnObj, btnNodes, btnObjs

//- ------------------------------ etc --------------------------------
console.warn = () => { }
/////////////////////////////////// custom //////////////////////////////////////////
// var audioModal, sourceModal
// let infoBtn = window.parent.document.querySelectorAll(".rano_scream");
// infoBtn.forEach(function (e) {
//     e.addEventListener("click", function () {
//         for (let btnObj of btnObjs) scene.remove(btnObj)
//         let modal2 = document.querySelector(`#sub_modal`)
//         modal2.style.display = 'flex'
//         gsap.to(modal2, {
//             bottom: "0%", opacity: 1, duration: 1, ease: 'Power3.easeOut',
//             onComplete: () => {
//                 let modalClose = modal2.querySelector('.modalClose')
//                 modalClose.addEventListener('click', () => {
//                     var audio = window.parent.document.getElementById('audio');
//                     audio.pause();
//                     for (let btnObj of btnObjs) scene.add(btnObj)
//                     gsap.to(modal2, {
//                         bottom: "-100px", opacity: 0, duration: 1, ease: 'Power3.ease',
//                         onComplete: () => { modal2.style.display = 'none' }
//                     })
//                 })
//             },
//         })
//     })
// })



// modalAudio
// const wgBtns = document.querySelectorAll(".wgBtn");
// let current = 1;
// wgBtns.forEach(audioBtn => {
//     audioBtn.setAttribute("data-url", `./assets/audio/${lastLang}/p${pageNum}_modal0${current++}_${lastLang}.mp3`)
//     audioBtn.addEventListener("click", function () {
//         audioModal = window.parent.document.getElementById("audioModal");
//         sourceModal = window.parent.document.getElementById("sourceModal");
//         // sourceModal.src = this.dataset.url;
//         audioModal.load();
//         audioModal.play();
//         // 기존 audio pause
//         let parent_audio = window.parent.document.getElementById('audio');
//         parent_audio.pause();
//     })
// })
// window.parent.document.querySelector('#wgBtn01').addEventListener("click", function(){
//     alert('hey')
// })



let sound1 = new Howl({
    src: ['./assets/audio/dino_scream.mp3']
})
let sound2 = new Howl({
    src: ['./assets/audio/wg06_ko.mp3']
})

document.querySelector('.dino_img > img').addEventListener('click', function () {
    gsap.to(camera.position, {
        x: camInitPos.x, y: camInitPos.y, z: camInitPos.z, duration: 1, ease: 'Power2.easeInOut',

    })

    if (!this.classList.contains('active')) {
        this.classList.add('active');
        $('.row').stop().slideDown(1000);
        document.querySelector('.click_me').classList.add('active');
        sound1.play();
        setTimeout(() => {
            sound2.play();
        }, 700)
        animatePlay(1);
    } else {
        this.classList.remove('active');
        setTimeout(function(){
            document.querySelector('.click_me').classList.remove('active');
        },700)
        $('.row').stop().slideUp(1000);
        sound2.stop();
        animatePlay(0);
    }

})