import { initLang, setTexts } from './lang.js'

//* ===================================================================
//*                             Settings                               
//* ===================================================================
//- ----------------------------- html --------------------------------
pageNum = '06'
targetElem = '#canvas'
//- ----------------------------- model -------------------------------
modelFile = './assets/model/wg03/pterodactyl.glb'
modelFile2 = './assets/model/wg03/test03.glb'
modelScale = 0.8
modelPos = { x: 0.1, y: -0.75, z: 0 }
camInitPos = { x: 1, y: 0.5, z: 6 }
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
addBtnFn('01', '', { x: 1.2, y: 1, z: 0 }, { x: 4.0, y: 1.0, z: 4 }, 0)
addBtnFn('02', '', { x: 0.8, y: 0.1, z: 0 }, { x: 4.0, y: 1.0, z: 4 }, 0)
addBtnFn('03', '', { x: -0.8, y: -0.3, z: 0 }, { x: -4.0, y: 1.0, z: 5 }, 0)
addBtnFn('04', '', { x: -1.4, y: 0.3, z: 0 }, { x: -4.0, y: 1.0, z: 4 }, 0)


//* ===================================================================
//*                               Core                                 
//* ===================================================================
//- --------------------------- initialFn -----------------------------
export function initialFn() {
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(45, canvasWidthFn() / canvasHeightFn(), 0.01, 5000)
    camera.position.set(camInitPos.x, camInitPos.y, camInitPos.z)
    camera.aspect = canvasWidthFn() / canvasHeightFn()
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio || 1)
    renderer.setSize(canvasWidthFn(), canvasHeightFn())
    renderer.shadowMap.enabled = true
    renderer.shadowMapSoft = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    domEvents = new THREEx.DomEvents(camera, renderer.domElement)
    renderer2d = new THREE.CSS2DRenderer()
    renderer2d.setSize(canvasWidthFn(), canvasHeightFn())
    renderer2d.domElement.style.position = 'absolute'
    renderer2d.domElement.style.top = '0px'
    renderer2d.domElement.style.zIndex = 9
    controls = new THREE.OrbitControls(camera, renderer.domElement)
    controls2d = new THREE.OrbitControls(camera, renderer2d.domElement)
    controls2d.minDistance = 3
    controls2d.maxDistance = 8
    controls2d.maxPolarAngle = Math.PI / 1.84
    controls2d.enablePan = false

    hLight = new THREE.HemisphereLight('#555')
    scene.add(hLight)

    dLight = new THREE.DirectionalLight('#fff', 4)
    dLight.position.set(2, 3, 0)
    dLight.castShadow = true
    dLight.shadow.camera.top = 3
    dLight.shadow.camera.bottom = -3
    dLight.shadow.camera.left = -3
    dLight.shadow.camera.right = 3
    // dLight.shadow.bias = 0.0000001
    dLight.shadow.radius = 0.1
    dLight.shadow.needsUpdate = true
    dLight.shadow.mapSize.width = 1024
    dLight.shadow.mapSize.height = 1024
    dLight.shadow.camera.far = 10

    dLight2 = new THREE.DirectionalLight('#fff', 0.5)
    dLight2.position.set(0, -3, 3)
    scene.add(dLight)
    scene.add(new THREE.CameraHelper(dLight.shadow.camera))
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
        modelObj.position.set(modelPos.x, 0, modelPos.z)
        modelObj.traverse(function(child) {
            if(child.isMesh) {
               child.needsUpdate = true;
               child.castShadow = true
               child.receiveShadow = true
               child.material.envMapIntensity = 20
               child.material.depthTest = true
               child.material.depthWrite = true
               child.material.side = THREE.DoubleSide;
               child.material.roughness = 1.5;                  
               child.material.transparent = true
               // child.renderOrder = 1
            }
         })
        modelObj.rotation.y = Math.PI / 2
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
        gsap.to(canvasEl, { opacity: 1, duration: 1.3, ease: 'Power0.easeNone', })
    })
}
//- ---------------------------- modelFn2 ------------------------------
export function modelFn2() {
    modelLoader2 = new THREE.GLTFLoader()
    modelLoader2.load(modelFile2, (gltf) => {
        modelObj2 = gltf.scene
        modelObj2.name = 'modelObj2'
        modelObj2.scale.set(0.25, 0.25, 0.25)
        modelObj2.position.set(modelPos.x, -1.5, modelPos.z)
        modelObj2.traverse(function(child) {
            if(child.isMesh) {
               child.needsUpdate = true;
               child.castShadow = true
               child.receiveShadow = true
               child.material.envMapIntensity = 50
               child.material.depthTest = true
               child.material.depthWrite = true
               child.material.side = THREE.DoubleSide;
               child.material.roughness = 10;                  
               child.material.transparent = true
               child.renderOrder = 1
            }
         })
        modelObj2.rotation.y = Math.PI / 2
        scene.add(modelObj2)

        let spinner = document.querySelector('.spinner')
        let canvasEl = document.querySelector('#canvas2')
        gsap.to(spinner, {
            opacity: 0, duration: 1.3, ease: 'Power0.easeNone',
            onComplete: () => spinner.style.display = 'none'
        })
        gsap.to(canvasEl, { opacity: 1, duration: 1.3, ease: 'Power0.easeNone', })
    })
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
    document.body.appendChild(btnNode)
    btnObj = new THREE.CSS2DObject(btnNode)
    btnObj.name = 'wgBtn' + btnNum
    btnObj.position.set(btnPos.x, btnPos.y, btnPos.z)
    btnNodes.push(btnNode)
    btnObjs.push(btnObj)
    scene.add(btnObj)
    tippy(`#wgBtn${btnNum}`, {
        content: `<span class="tooltipTitle" id="p${pageNum}BtnT${btnNum}">${tippyTitle}</span>`,
        allowHTML: true, arrow: true, animation: 'animate01',
        delay: [0, 100], duration: 500, placement: 'right-start',
        onMount(instance) {
            setTexts(initLang())
        }
    })
    btnNode.addEventListener('click', () => {
        alert
        animatePlay(aniIndex)
        let tippyItems = document.querySelectorAll('[id*="tippy-"]')
        for (let item of tippyItems) item.style.display = 'none'
        for (let btnObj of btnObjs) scene.remove(btnObj)
        gsap.to(camera.position, { x: camMovePos.x, y: camMovePos.y, z: camMovePos.z, duration: 1, ease: 'Power2.easeInOut', onComplete: () => { } })
        gsap.to(modelObj.position, { y: '+=0.2', duration: 1, ease: 'Power1.easeOut', onComplete: () => { } })
        let modal = document.querySelector(`#modal${btnNum}`)
        modal.style.display = 'flex'
        gsap.to(modal, {
            bottom:"0%", opacity: 1, duration: 1, ease: 'Power3.easeOut',
            onComplete: () => {
                let modalClose = modal.querySelector('.modalClose')
                modalClose.addEventListener('click', () => {
                    animatePlay(anyNum)
                    gsap.to(modal, {
                        bottom:"-100px", opacity: 0, duration: 1, ease: 'Power3.ease',
                        onComplete: () => { modal.style.display = 'none' }
                    })
                    gsap.to(camera.position, {
                        x: camInitPos.x, y: camInitPos.y, z: camInitPos.z, duration: 1, ease: 'Power2.easeInOut',
                        onComplete: () => {
                            for (let btnObj of btnObjs) scene.add(btnObj)
                            for (let item of tippyItems) item.style.display = 'block'
                        }
                    })
                    gsap.to(modelObj.position, { y: '-=0.2', duration: 1, ease: 'Power1.easeOut', onComplete: () => { } })
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
        if (innerHeight < 300) camera.zoom = 1.8
        else if (innerHeight < 400) camera.zoom = 1.6
        else if (innerHeight < 500) camera.zoom = 1.4
        else if (innerHeight < 600) camera.zoom = 1.2
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
    return window.innerWidth
}
//- ------------------------ canvasHeightFn ---------------------------
function canvasHeightFn() {
    return window.innerHeight
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
    if (!scene.children.includes(modelObj2)) scene.add(modelObj2)
    if (modelObj.children.length === 0) {
        modelFn()
    }
    if (modelObj2.children.length === 0) {
        modelFn2()
    }
}
//- ---------------------------- turnOff ------------------------------
export function turnOff() {
    if (scene.children.includes(hLight)) scene.remove(hLight)
    if (scene.children.includes(dLight)) scene.remove(dLight)
    if (scene.children.includes(btnObj)) scene.remove(btnObj)
    if (scene.children.includes(modelObj)) scene.remove(modelObj)
    if (scene.children.includes(modelObj2)) scene.remove(modelObj2)
    modelObj.remove.apply(modelObj, modelObj.children)
    modelObj2.remove.apply(modelObj2, modelObj2.children)
}


//* ===================================================================
//*                             Variables                              
//* ===================================================================
//- ---------------------------- setting ------------------------------
var targetElem, pageNum, anyNum
var modelFile, modelFile2, modelScale, modelPos, camInitPos
//- ---------------------------- initFn -------------------------------
var scene, camera, renderer, controls, controls2d, hLight, dLight, dLight2, renderer2d, domEvents
//- ---------------------------- modelFn ------------------------------
var modelLoader, modelLoader2, mixer, modelObj, modelObj2, animates
//- --------------------------- updateFn ------------------------------
var clock
//- ----------------------------- btnFn -------------------------------
var btnHtml, btnNode, btnObj, btnNodes, btnObjs
//- ------------------------- canvasWidthFn ---------------------------
var canvasWidth
//- ------------------------------ etc --------------------------------
console.warn = () => { }
