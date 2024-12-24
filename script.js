let detik = 0;
let ronde = 1;
const maxRonde = 1;
let questions = [];
let kolomUtama = [];
let countdown;
let currentQuestionIndex = 0;
let rondeResults = [];

function startQuiz() {
    document.getElementById("start-page").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    buatSoal();
    tampilkanKolomUtama();
    tampilkanSoal(currentQuestionIndex);
    startTimer();
}

function resetQuiz() {
    location.reload(); // Reload halaman
}

function acakHuruf(jumlah) {
    const huruf = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let hasil = [];
    while (hasil.length < jumlah) {
        const randomHuruf = huruf[Math.floor(Math.random() * huruf.length)];
        if (!hasil.includes(randomHuruf)) hasil.push(randomHuruf);
    }
    return hasil;
}

function buatSoal() {
    kolomUtama = acakHuruf(5); // A, B, C, D, E
    questions = [];
    for (let i = 0; i < 50; i++) {
        let hilangIndex = Math.floor(Math.random() * 5);
        let hurufYangHilang = kolomUtama[hilangIndex];
        let kolomKedua = [...kolomUtama];
        kolomKedua[hilangIndex] = "";

        kolomKedua = kolomKedua
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);

        questions.push({
            kolomKedua,
            hurufYangHilang,
            chosenAnswer: null,
        });
    }
}

function tampilkanKolomUtama() {
    const elemen = document.getElementById("kolom-utama");
    elemen.innerHTML = kolomUtama
        .map((h) => `
            <div class="flex justify-center items-center p-4 bg-green-600 text-white text-center font-medium text-lg rounded shadow">
                ${h}
            </div>
        `)
        .join('');
}

function tampilkanSoal(index) {
    const soalContainer = document.getElementById("soal-container");
    const { kolomKedua } = questions[index];

    soalContainer.innerHTML = ` 
        <div class="p-4 bg-[#003233]">
            <h3 class="text-sm font-semibold mb-2">Soal ${index + 1}</h3>
            <div id="kolom-kedua" class="grid grid-cols-5 gap-2 mb-4"></div>
            <div class="text-center font-semibold mb-4">Pilih huruf yang hilang:</div>
            <div id="pilihan-jawaban" class="grid grid-cols-5 gap-2"></div>
        </div>
    `;

    tampilkanKolom("kolom-kedua", kolomKedua);
    tampilkanPilihan("pilihan-jawaban", index);
}

function tampilkanKolom(id, data) {
    const elemen = document.getElementById(id);
    elemen.innerHTML = data
        .filter((h) => h !== "")
        .map((h) => `
            <div class="p-2 bg-green-600 text-white text-center font-bold text-xl rounded">
                ${h}
            </div>
        `)
        .join('');
}

function tampilkanPilihan(id, index) {
    const elemen = document.getElementById(id);
    const soal = questions[index];
    const kolomUtamaMap = kolomUtama.map((huruf, idx) => {
        return {
            huruf: huruf,
            urutan: String.fromCharCode(65 + idx) // Menyusun A, B, C, D, E berdasarkan urutan kolom
        };
    });

    elemen.innerHTML = kolomUtamaMap.map((option) =>
        `<button onclick="pilihHuruf('${soal.hurufYangHilang}', '${option.huruf}', ${index})"
        class="p-4 md:px-4 md:py-4 lg:px-3 lg:py-5 xl:px-3 xl:py-5 bg-green-500 text-center text-white font-bold text-lg cursor-pointer rounded hover:bg-green-200 active:scale-90 transition-transform">
        ${option.urutan}
    </button>`
    ).join('');
}

function pilihHuruf(jawabanBenar, jawabanPilih, index) {
    const buttons = document.querySelectorAll(`#pilihan-jawaban button`);
    buttons.forEach(button => {
        if (button.textContent === jawabanPilih) {
            button.classList.add("animate-bounce");
        }
    });

    questions[index].chosenAnswer = jawabanPilih;

    setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            tampilkanSoal(currentQuestionIndex);
        } else {
            clearInterval(countdown);
            endRound();
        }
    }, 300);
}

function startTimer() {
    detik = 60;
    updateTimerDisplay();
    countdown = setInterval(() => {
        detik--;
        updateTimerDisplay();

        if (detik <= 5 && detik > 0) playTimerSound();
        if (detik < 0) {
            clearInterval(countdown);
            endRound();
        }
    }, 1000);
}

function playTimerSound() {
    const timerSound = document.getElementById("timer-sound");
    timerSound.play();
}

function updateTimerDisplay() {
    const menit = String(Math.floor(detik / 60)).padStart(2, "0");
    const detikFormat = String(detik % 60).padStart(2, "0");
    document.getElementById("timer").textContent = `${menit}:${detikFormat}`;
}

function endRound() {
    const benar = questions.filter((q) => q.hurufYangHilang === q.chosenAnswer).length;
    const salah = questions.filter((q) => q.chosenAnswer !== null && q.hurufYangHilang !== q.chosenAnswer).length;
    const tidakTerjawab = questions.filter((q) => q.chosenAnswer === null).length;

    rondeResults.push({ benar, salah, tidakTerjawab });

    if (ronde < maxRonde) {
        ronde++;
        document.getElementById("round-info").textContent = `Ronde ${ronde}`;
        currentQuestionIndex = 0;
        buatSoal();
        tampilkanKolomUtama();
        tampilkanSoal(currentQuestionIndex);
        startTimer();
    } else {
        showFinalResults();
    }
}

function showFinalResults() {
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = `
        <h2 class="text-xl font-bold text-center mb-4">Hasil Akhir</h2>
        <div class="grid grid-cols-5 gap-2">
            ${rondeResults.map((result, index) => `
                <div class="border p-2 rounded shadow-md text-center">
                    <div class="font-semibold">Ronde ${index + 1}</div>
                    <div>Benar: ${result.benar}</div>
                    <div>Salah: ${result.salah}</div>
                    <div>Tidak Terjawab: ${result.tidakTerjawab}</div>
                </div>
            `).join('')}
        </div>
        <button onclick="resetQuiz()" class="bg-red-600 text-white py-2 px-4 rounded shadow mt-4">
            Restart Quiz
        </button>
    `;
}
