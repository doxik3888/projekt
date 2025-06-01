const progress = document.querySelector('.xv1-progress')    
function initPlayer() {
    const btn = document.querySelector('.xv1-playbtn')
    const audio = document.getElementById('audioPlayer')
    btn.addEventListener('click',() => {
    if (audio.paused) {
        audio.play()
        btn.innerHTML = '<i class="fas fa-pause"></i>'
        document.documentElement.style.setProperty('--animationplaystate', 'running')
    } else {
        audio.pause()
        btn.innerHTML = '<i class="fas fa-play"></i>'
        document.documentElement.style.setProperty('--animationplaystate', 'paused')
    }
    })
    const time = document.querySelector('.xv1-time')
    audio.addEventListener('timeupdate', () => {
        progress.style.width = `${audio.currentTime / audio.duration * 100}%`
        let minutes = Math.floor(audio.currentTime / 60)
        let seconds = Math.floor(audio.currentTime % 60).toString().padStart(2, "0")
        // let maxMinutes = Math.floor(audio.currentTime / 60)
        // let maxSeconds = Math.floor(audio.currentTime % 60).toString().padStart(2, "0") ${maxMinutes}:${maxSeconds}
         time.innerHTML = `${minutes}:${seconds} / 2:52`
    })
    document.querySelector('.xv1-progressbar').addEventListener('click', (e) => {
        const rect = e.target.getBoundingClientRect()
        const pos = (e.clientX - rect.left) / rect.width
        audio.currentTime = pos * audio.duration
    })
}

document.addEventListener("DOMContentLoaded", initPlayer)