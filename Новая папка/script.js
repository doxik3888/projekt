document.addEventListener('DOMContentLoaded', () => {
    // Получаем элементы DOM
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d'); // Контекст 2D для рисования
    const clearCanvasBtn = document.getElementById('clearCanvasBtn');
    const particleColorInput = document.getElementById('particleColor');
    const particleSizeInput = document.getElementById('particleSize');
    const currentSizeSpan = document.getElementById('currentSize');
    const particleDensityInput = document.getElementById('particleDensity');
    const currentDensitySpan = document.getElementById('currentDensity');

    // --- Настройки по умолчанию ---
    let particles = []; // Массив для хранения всех частиц
    let mouse = { x: null, y: null, pressed: false }; // Позиция мыши и состояние нажатия
    let hue = 150; // Начальный оттенок для цвета (150 = зеленый)

    // Настройки частиц
    let particleSize = parseInt(particleSizeInput.value); // Размер частиц
    let particleDensity = parseInt(particleDensityInput.value); // Плотность/количество частиц при движении
    let particleColor = particleColorInput.value; // Текущий цвет частиц

    // --- Класс Particle (частица) ---
    class Particle {
        constructor(x, y, size, color) {
            this.x = x;
            this.y = y;
            // Случайные начальные скорости для небольшого "разлета"
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.size = size;
            this.color = color;
            this.life = 100; // Жизнь частицы (100% = полная жизнь)
            this.opacity = 1; // Начальная прозрачность
        }

        // Обновление состояния частицы
        update() {
            // Применение гравитации (небольшой дрейф вниз)
            this.vy += 0.02;
            // Уменьшение скорости со временем (трение)
            this.vx *= 0.98;
            this.vy *= 0.98;

            this.x += this.vx;
            this.y += this.vy;

            this.life -= 0.5; // Уменьшаем жизнь частицы
            this.opacity = this.life / 100; // Прозрачность зависит от жизни
        }

        // Рисование частицы
        draw() {
            ctx.fillStyle = `rgba(${this.hexToRgb(this.color).r}, ${this.hexToRgb(this.color).g}, ${this.hexToRgb(this.color).b}, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();

            // Эффект свечения
            ctx.shadowBlur = this.size * 2; // Размытие тени
            ctx.shadowColor = `rgba(${this.hexToRgb(this.color).r}, ${this.hexToRgb(this.color).g}, ${this.hexToRgb(this.color).b}, ${this.opacity * 0.8})`;
        }

        // Вспомогательная функция для преобразования HEX в RGB
        hexToRgb(hex) {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return { r, g, b };
        }
    }

    // --- Функции холста ---

    // Устанавливаем размер холста под размер окна
    function resizeCanvas() {
        canvas.width = window.innerWidth * 0.8; // 80% ширины окна
        canvas.height = window.innerHeight * 0.7; // 70% высоты окна
        // Ограничиваем максимальные размеры, чтобы не было слишком огромным
        canvas.width = Math.min(canvas.width, 800);
        canvas.height = Math.min(canvas.height, 600);
    }

    // Обработчик движения мыши
    canvas.addEventListener('mousemove', (e) => {
        // Получаем координаты мыши относительно холста
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;

        // Создаем частицы, если мышь зажата или просто движется
        if (mouse.x !== null && mouse.y !== null) {
            let numParticles = particleDensity;
            if (mouse.pressed) { // Если кнопка мыши зажата, создаем больше частиц (эффект "brush")
                numParticles *= 2;
            }
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle(mouse.x, mouse.y, particleSize, particleColor));
            }
        }
    });

    // Обработчик нажатия кнопки мыши
    canvas.addEventListener('mousedown', (e) => {
        if (e.button === 0) { // Левая кнопка мыши
            mouse.pressed = true;
        }
    });

    // Обработчик отпускания кнопки мыши
    canvas.addEventListener('mouseup', (e) => {
        if (e.button === 0) {
            mouse.pressed = false;
        }
    });

    // Обработчик ухода мыши с холста
    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
        mouse.pressed = false;
    });


    // --- Основной цикл анимации ---
    function animate() {
        // Заливаем холст очень прозрачным черным цветом
        // Это создает эффект "следа" и постепенного исчезновения частиц
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'; // Чем выше альфа, тем быстрее исчезают следы
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Сбрасываем тень для основного холста, чтобы она не влияла на последующие частицы
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';

        // Обновляем и рисуем все частицы
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Удаляем частицы, у которых закончилась жизнь
            if (particles[i].life <= 0) {
                particles.splice(i, 1);
                i--; // Корректируем индекс после удаления элемента
            }
        }

        requestAnimationFrame(animate); // Запрашиваем следующий кадр анимации
    }

    // --- Обработчики элементов управления ---

    // Кнопка очистки холста
    clearCanvasBtn.addEventListener('click', () => {
        particles = []; // Просто очищаем массив частиц
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем весь холст
        displayMessage('Холст очищен!', 'info');
    });

    // Выбор цвета
    particleColorInput.addEventListener('input', (e) => {
        particleColor = e.target.value;
    });

    // Изменение размера частиц
    particleSizeInput.addEventListener('input', (e) => {
        particleSize = parseInt(e.target.value);
        currentSizeSpan.textContent = particleSize;
    });

    // Изменение плотности частиц
    particleDensityInput.addEventListener('input', (e) => {
        particleDensity = parseInt(e.target.value);
        currentDensitySpan.textContent = particleDensity;
    });

    // --- Вспомогательная функция для сообщений (как в прошлых проектах) ---
    function displayMessage(msg, type = '') {
        // Можно использовать существующий элемент, например, внизу холста,
        // или создать временный. Для простоты, сделаем его временным
        let tempMsg = document.createElement('div');
        tempMsg.classList.add('temp-message');
        tempMsg.textContent = msg;
        document.body.appendChild(tempMsg);

        // Простая анимация появления/исчезновения
        setTimeout(() => {
            tempMsg.style.opacity = '1';
            tempMsg.style.transform = 'translateY(0)';
        }, 10); // Небольшая задержка для применения начальных стилей

        setTimeout(() => {
            tempMsg.style.opacity = '0';
            tempMsg.style.transform = 'translateY(-20px)';
            tempMsg.addEventListener('transitionend', () => tempMsg.remove());
        }, 2000); // Сообщение исчезнет через 2 секунды
    }
    // Добавим стили для temp-message в CSS, если используется (не забыть!)
    /*
    .temp-message {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background-color: rgba(0, 0, 0, 0.7);
        color: #fff;
        padding: 10px 20px;
        border-radius: 8px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        font-size: 0.9em;
    }
    */


    // --- Инициализация ---
    resizeCanvas(); // Устанавливаем начальный размер холста
    window.addEventListener('resize', resizeCanvas); // Переразмер при изменении окна
    animate(); // Запускаем цикл анимации
});