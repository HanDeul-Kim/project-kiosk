// 100vh 주소창 미포함
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty("--vh", `${vh}px`);

window.addEventListener("resize", () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
});


window.addEventListener("scroll", function () {
    // document 끝 도달시 quiz visible
    const allHeight = document.documentElement.scrollHeight;
    const currentHeight = window.innerHeight
    const documentHeight = allHeight - currentHeight;
    let result = document.querySelector(".result");

    if (scrollY + 10 >= documentHeight) {
        result.classList.add("active");
        document.querySelector('#v3d-container > canvas').classList.add('active');
    } else {
        result.classList.remove("active");
        document.querySelector('#v3d-container > canvas').classList.remove('active');
    }


    // progressBar
    const progressBar = document.querySelector('.progress-bar');
    const fullHeight = document.documentElement.scrollHeight;
    const nowHeight = window.innerHeight;

    // scrollTop
    const modals = document.querySelectorAll('.modal');
    const dots = document.querySelectorAll('.dot')
    let currentSection;
    let activeIdx;
    modals.forEach((modal, idx) => {

        if (scrollY + 10 >= modal.offsetTop) {
            // currentSection = modals[idx];
            currentSection = modal.getAttribute('id');
            activeIdx = idx;
            dots.forEach(function (menu) {
                menu.classList.remove('active');
            })
            dots[idx].classList.add('active')
        }
    })
    if(currentSection == 'modal7') {
        document.querySelector('#v3d-container').style.zIndex = '1'
    }
    $(modals[activeIdx]).children("div").addClass('active')
})

// // modal nav & 좌측 nav
// const menuList = document.querySelectorAll('.menu a');
const modalBtns = document.querySelectorAll('.next');

modalBtns.forEach(navBtn => {
    navBtn.addEventListener('click', function (e) {
        e.preventDefault();
        gsap.to(window, {
            duration: 2,
            scrollTo: {
                y: `${navBtn.getAttribute('href')}`,
                ease: "power3.out"
            }
        })
    })
})




// // narration audio
function playNarration(dataValue) {
    let audio = document.getElementById('audio');
    let source = document.getElementById('source');
    source.src = `./assets/audio/scroll1_${dataValue}.mp3`;
    audio.load();
    // audio.play();
    var playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(_ => {
        })
            .catch(error => {
            });
    }
}

const modalCons = document.querySelectorAll('.next');
const dots = document.querySelectorAll('.dot a');
const lastAudio = document.querySelector('.last_audio');
const elArr = [];
for (let modals of modalCons)
    for (let dotList of dots)
        elArr.push(modals, dotList, lastAudio)

for (let allEl of elArr) {
    allEl.addEventListener("click", function () {
        playNarration(this.dataset.audio)
    })
}





// quiz
const questions = document.querySelectorAll(".question");
for (let question of questions) {

    const correct = document.querySelector('.correct');
    const wrong = document.querySelector('.wrong');
    const gifArr = [correct, wrong];

    question.addEventListener("click", function () {
        gifArr.forEach(function (e) {
            e.classList.remove('active');
        })
        if (this.dataset.result == "x") {
            this.classList.add("active");
            document.querySelector('.wrong').classList.add("active");
            removeAnim();
        } else {
            document.querySelector(".next_page").classList.add("active")
            document.querySelector('.correct').classList.add("active");
        }
    })
}
function removeAnim() {
    setTimeout(function () {
        questions.forEach(function (question) {
            question.classList.remove("active");
        })
    }, 500)
}


// load일때 모델링 index down
window.addEventListener('load', function () {
    const interval = setInterval(function () {
        if (document.querySelector('.v3d-simple-preloader-bar').style.width == '100%') {
            setTimeout(function () {
                document.querySelector('#v3d-container').style.zIndex = 0;
            }, 1000)
            removeInterval();
        }
    }, 100)
    function removeInterval() {
        clearInterval(interval)
    }
    gsap.to(window, {
        scrollTo: {
            y: 0,
        }
    })

})

