let clicker = document.querySelector(".clicker")
let likes = document.querySelector(".amount")
clicker.addEventListener("click", () => {
    if (+likes.innerHTML == 20) {
        location.assign("https://rutube.ru/video/c6cc4d620b1d4338901770a44b3e82f4/")
    } else {
        likes.innerHTML = +likes.innerHTML + 1  
    }
})