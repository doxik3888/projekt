function initGallery(){
    let gallery = document.querySelector(".gallery")
    let galleryItem = document.querySelectorAll(".gallery-item")
    gallery.style.setProperty("--total-item", galleryItem.length)

    gallery.addEventListener("click", (event) =>{
        let clicked = event.target.closest(".gallery-item")
        if (!clicked || clicked.classList.contains("active")) return

        galleryItem.forEach((item) => {
            item.classList.remove("active")
        })
        clicked.classList.add("active")
    })

}

document.addEventListener("DOMContentLoaded",initGallery)
