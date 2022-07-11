//100vh
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty("--vh", `${vh}px`);

window.addEventListener("resize", () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
});

let eventName;

function eventChange() {
    if (window.matchMedia("(max-width:1500px) and (orientation: landscape)").matches) {
        eventName = 'touchstart';
    } else {
        eventName = 'click';
    }
}
eventChange();

window.addEventListener('resize', () => {
    eventChange();
})
// audio
let sound1 = new Howl({
    src: ['./assets/audio/clear.mp3']
})
let sound2 = new Howl({
    src: ['./assets/audio/break.mp3']
})
let sound3 = new Howl({
    src: ['./assets/audio/menu.mp3']
})
let sound4 = new Howl({
    src: ['./assets/audio/fix.mp3']
})
// menu
const modalBtn = document.querySelector(".menu");
let tlModal = gsap.timeline({}).reverse();
tlModal.to(".menu", { scale: 1.4, rotation: 180, duration: 0.3, })
    .to(".modal", { top: "0", ease: Expo.easeOut, duration: 1, })

modalBtn.addEventListener(eventName, function () {
    tlModal.reversed(!tlModal.reversed());
})
// modal
const modalDots = document.querySelectorAll('.dot');
const modalContents = document.querySelectorAll('.modal_copyright');
modalDots.forEach((btn, index) => {
    btn.addEventListener(eventName, function () {
        for (var i = 0; i < modalDots.length; i++) {
            modalDots[i].classList.remove('active');
        }
        modalContents.forEach(btns => {
            btns.classList.remove('active');
        })
        const navContent = document.querySelector(`.copyright0${Number(index + 1)}`)
        navContent.classList.add('active');
        btn.classList.add('active');
    })
})
// swiper
var swiper = new Swiper(".swiper", {
    speed: 1500,
    direction: 'vertical',
    mousewheel: {
        invert: false,
    },
    pagination: {
        el: ".swiper-pagination",
        // clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },

    // swipe도중 pause
    followFinger: false,
    // 전환 이벤트 중복방지
    preventInteractionOnTransition: true,
    // allowTouchMove: false,
    //초기 슬라이드페이지
    // initialSlide: 0,

    on: {
        activeIndexChange: function () {
            document.querySelector('.mute').style.opacity = 1;
            document.querySelector('.mute').style.visibility = "visible";
            sound1.play();
            // Lock
            if (Number(localStorage.getItem('step_ko')) >= this.realIndex) {
                swiper.allowSlideNext = true;
            } else {
                swiper.allowSlideNext = false
            }

            // 화살표 버튼 change
            const sections = document.querySelectorAll('.swiper-slide')
            if (Number(localStorage.getItem('step_ko')) == swiper.realIndex - 1 && this.realIndex < sections.length - 1) {
                document.querySelector('.swiper-button-next').classList.add('active');
                // addImg();
            } else if (this.realIndex == sections.length - 1) {
                // alert("미션 클리어 축하합니다")
            } else {
                // removeImg();
                document.querySelector('.swiper-button-next').classList.remove('active');
            }

            const stepNav = document.querySelector('.step_nav');
            const swPagi = document.querySelector('.swiper-pagination');
            const bottomLogo = document.querySelector('.bottom_logo');
            const elArr = [stepNav, swPagi, bottomLogo];
            for (let element of elArr) {
                function activeClass(targetEl) {
                    if (swiper.isBeginning) {
                        targetEl.classList.remove('active');
                    } else {
                        targetEl.classList.add('active');
                        const textLevel = document.querySelector('.center_text')
                        textLevel.innerHTML = `레벨${swiper.realIndex}`
                    }
                }
                activeClass(element)
            }
        },
    },

});




window.addEventListener('keydown', function (e) {
    if (e.code == "Tab") {
        e.preventDefault();
    }
})
// start click
document.querySelector('.start').addEventListener(eventName, () => { swiper.slideNext(2000, true) })

// function addImg() {
//     var imgEl = document.createElement('img');
//     imgEl.src = "./assets/img/lock.png"
//     imgEl.className = 'lock_img'
//     document.querySelector(`.sec${Number(localStorage.getItem('step')) + 2}`).append(imgEl);
//     // sections[Number(localStorage.getItem('step')) + 1].append(imgEl);
// }
// function removeImg() {
//     // document.querySelector('.lock_img').remove();
//     document.querySelectorAll('.lock_img').forEach(function (e) {
//         e.remove();
//     })
// }



// bullets Lock Bg
const bullets = document.querySelectorAll('.swiper-pagination-bullet');
$(bullets[Number(localStorage.getItem('step_ko')) + 1]).nextAll().css({
    "opacity": "0.5",
    "background": "url('./assets/img/mini_lock.png') no-repeat center center / cover",
    "border-radius": "0",
    "width": "24px",
    "height": "31px"
}).addClass("locked")

// bullet Click event
bullets.forEach(function (bullet, idx) {
    bullet.addEventListener("click", function () {
        if (this.classList.contains("locked")) {
            swiper.slideTo(swiper.realIndex);
        } else {
            swiper.slideTo(idx);
        }
    })
})

// stage 깼을때 
function comeBackStage() {
    window.addEventListener("load", function () {
        if (swiper.realIndex == 0 && Number(this.localStorage.getItem('step_ko')) == 0) {
            swiper.slideTo(0);
        } else if (Number(localStorage.getItem('step_ko')) >= swiper.realIndex) {
            swiper.slideTo(Number(localStorage.getItem('step_ko')) + 1)
            document.querySelector('.mute').style.opacity = 0;
            document.querySelector('.mute').style.visibility = 'hidden';
        }
    })
}
comeBackStage()

// sand effect
const breakEl = document.querySelectorAll('.dino_break');
// const effects = document.querySelectorAll('.effect');
const canvasEffect = document.getElementById('c_effect');
const originals = document.querySelectorAll('.original');
const fixs = document.querySelectorAll('.fix-inner');
fixs.forEach(function (breakBtn, index) {
    breakBtn.addEventListener(eventName, function () {
        swiper.disable()
        dinoBreak();


        // sound2.play();
        fixs[index].classList.add('active');
    })

    // callback
    function dinoBreak() {
        function delay(callback) {
            callback();
        }

        delay(function () {
            // breakEl[index].classList.add('active');
            sound4.play();
            setTimeout(function () {
                fixs[index].classList.add('none');
                delay(function () {
                    setTimeout(function () {
                        breakEl[index].classList.add('active');
                        canvasEffect.classList.add('active');
                        sound2.play();
                        delay(function () {
                            setTimeout(function () {
                                originals[index].classList.add('active');
                                setTimeout(function (){
                                    canvasEffect.classList.remove('active');
                                    swiper.enable()
                                },2000)
                            }, 2000)
                        })
                    }, 1000)
                })
            }, 2000)
        })
    }
})

// dino_Break remove
const dinoBreak = document.querySelectorAll('.dino_break');
const steps = document.querySelectorAll('.swiper-slide');
function breakRemove() {
    $(steps[Number(localStorage.getItem('step_ko')) + 1]).prevAll().children('.dino_break').css('display', 'none');
    $(steps[Number(localStorage.getItem('step_ko')) + 1]).prevAll().children('.fix-inner').css('display', 'none');
    $(steps[Number(localStorage.getItem('step_ko')) + 1]).prevAll().children('.original').addClass('active');
    $(steps[Number(localStorage.getItem('step_ko')) + 1]).prevAll().children('.original').addClass('remove');
    if (Number(localStorage.getItem('step_ko')) == steps.length - 1) {

        dinoBreak.forEach(function (e) {
            e.style.display = 'none';
        })
        fixs.forEach(function (e) {
            e.style.display = 'none';
        })
        originals.forEach(function (e) {
            e.classList.add('active');
            e.classList.add('remove');
        })
    }
}
breakRemove();


// menu sound
const menu = document.querySelector('.menu');
menu.addEventListener(eventName, function () {
    sound3.play();
})


// background sound
var audioBack, sourceBack;
let funArr = [backBgmOn];

function touchBg() {
    window.addEventListener("touchstart", function () {
        document.querySelector('.mute').style.opacity = 1;
        document.querySelector('.mute').style.visibility = "visible";

        funArr[0]();
        funArr = [];
    }, { once: true })
}
function clickBg() {
    window.addEventListener("click", function () {
        document.querySelector('.mute').style.opacity = 1;
        document.querySelector('.mute').style.visibility = "visible";

        funArr[0]();
        funArr = [];
    }, { once: true })
}
touchBg();
clickBg();

function backBgmOn() {
    audioBack = document.getElementById('cover_back')
    sourceBack = document.getElementById('source_back')
    sourceBack.src = `./assets/audio/background.mp3`
    audioBack.load();
    audioBack.play();
}

const mute = document.querySelector('.mute');
mute.addEventListener("click", function () {
    this.classList.toggle('active');
    if (this.classList.contains('active')) {
        this.querySelector('img').src = './assets/img/sound_off.png';
        audioBack.muted = true;
        sound1.mute(true);
        sound2.mute(true);
        sound3.mute(true);
        sound4.mute(true);

    } else {
        this.querySelector('img').src = './assets/img/sound_on.png';
        audioBack.muted = false;
        sound1.mute(false);
        sound2.mute(false);
        sound3.mute(false);
        sound4.mute(false);


    }
})

// swiper flicker 방지
const sWrapper = document.querySelector('.swiper-wrapper');
const sSlides = document.querySelectorAll('.swiper-slide');
if (window.matchMedia("(max-width:1000px) and (orientation: landscape)").matches) {
    sWrapper.style.transformStyle = 'preserve-3d';
    sWrapper.style.transform = 'translateZ(0)'
    sSlides.forEach(function (slide) {
        slide.style.backfaceVisibility = 'hidden';
        slide.style.transform = 'translateZ(0)';
    })
}





