let langList = document.querySelector('.langList')
let langBtn = document.querySelector('#langBtn')
let langState = false
let oldTimeOut


// document.body.addEventListener('click', e => {
//   if(!langState && e.target.parentNode === langBtn) {
//     langState = true
//     langList.style.display = 'block'
//     langList.style.transition = 'opacity 0.5s'
//     clearTimeout(oldTimeOut)
//     oldTimeOut = setTimeout(() => langList.style.opacity = 1, 1)
//   } else {
//     langState = false
//     langList.style.transition = 'opacity 0.3s'
//     langList.style.opacity = 0
//     clearTimeout(oldTimeOut)
//     oldTimeOut = setTimeout(() => langList.style.display = 'none', 300)
//   }
// })


