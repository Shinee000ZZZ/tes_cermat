let detik = 0;
let ronde = 1;
const maxRonde = 10;
let questions = [];
let kolomUtama = [];
let countdown;
let currentQuestionIndex = 0;
let rondeResults = [];
let quizType = ""; // Menyimpan jenis quiz: "huruf" atau "angka"

function showQuizOptions() {
    document.getElementById("start-page").classList.add("hidden");
    document.getElementById("quiz-options").classList.remove("hidden");
}

function startQuiz(type) {
    quizType = type; // Simpan jenis quiz
    document.getElementById("quiz-options").classList.add("hidden");
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

function acakAngka(jumlah) {
    let hasil = [];
    while (hasil.length < jumlah) {
        const randomAngka = (Math.floor(Math.random() * 9) + 1).toString(); // Angka antara 1-9
        if (!hasil.includes(randomAngka)) hasil.push(randomAngka);
    }
    return hasil;
}

function buatSoal() {
    kolomUtama = quizType === "huruf" ? acakHuruf(5) : acakAngka(5);
    questions = [];
    for (let i = 0; i < 50; i++) {
        let hilangIndex = Math.floor(Math.random() * 5); // Pilih elemen yang hilang secara acak
        let elemenYangHilang = kolomUtama[hilangIndex]; // Elemen yang akan hilang
        let kolomKedua = [...kolomUtama];
        kolomKedua[hilangIndex] = ""; // Ganti elemen yang hilang dengan string kosong

        // Acak kolom kedua
        kolomKedua = kolomKedua
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);

        // Opsi jawaban tetap ABCDE
        const pilihan = ["A", "B", "C", "D", "E"];
        const jawabanBenarIndex = Math.floor(Math.random() * 5); // Tentukan posisi jawaban benar
        const opsiJawaban = [...pilihan];

        questions.push({
            kolomKedua,
            elemenYangHilang,
            pilihan: opsiJawaban,
            chosenAnswer: null,
            jawabanIndex: hilangIndex,
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
        .join("");
}

function tampilkanSoal(index) {
    const soalContainer = document.getElementById("soal-container");
    const { kolomKedua, pilihan } = questions[index];

    soalContainer.innerHTML = ` 
        <div class="p-4 bg-[#003233]">
            <h3 class="text-sm font-semibold mb-2">Soal ${index + 1}/50</h3>
            <div id="kolom-kedua" class="grid grid-cols-5 gap-2 mb-4"></div>
            <div class="text-center font-semibold mb-4">Pilih huruf atau angka yang hilang:</div>
            <div id="pilihan-jawaban" class="grid grid-cols-5 gap-2"></div>
        </div>
    `;

    tampilkanKolom("kolom-kedua", kolomKedua);
    tampilkanPilihan("pilihan-jawaban", pilihan, index);
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
        .join("");
}

function tampilkanPilihan(id, pilihan, index) {
    const elemen = document.getElementById(id);
    const soal = questions[index];
    elemen.innerHTML = pilihan.map((option, opsiIndex) =>
        `<button onclick="pilihElemen(${soal.jawabanIndex}, ${opsiIndex}, ${index})"
        class="p-4 bg-green-500 text-center text-white font-bold text-lg cursor-pointer rounded hover:bg-green-200 active:scale-90 transition-transform">
        ${option}
    </button>`
    ).join("");
}

function pilihElemen(jawabanIndex, opsiIndex, index) {
    const buttons = document.querySelectorAll(`#pilihan-jawaban button`);

    questions[index].chosenAnswer = opsiIndex;

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
    const benar = questions.filter((q) => q.jawabanIndex === q.chosenAnswer).length;
    const salah = questions.filter((q) => q.chosenAnswer !== null && q.jawabanIndex !== q.chosenAnswer).length;
    const tidakTerjawab = questions.filter((q) => q.chosenAnswer === null).length;

    rondeResults.push({ benar, salah, tidakTerjawab });

    if (ronde < maxRonde) {
        ronde++;
        document.getElementById("round-info").textContent = `Ronde ${ronde}/10`;
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
        <div class="grid grid-cols-4 gap-2">
            ${rondeResults
                .map(
                    (result, index) => `
                <div class="border p-2 rounded shadow-md text-start">
                    <div class="font-semibold">Ronde ${index + 1}</div>
                    <div>Benar: ${result.benar}</div>
                    <div>Salah: ${result.salah}</div>
                    <div>Tidak Terjawab: ${result.tidakTerjawab}</div>
                </div>
            `
                )
                .join("")}
        </div>
        <button onclick="resetQuiz()" class="bg-red-600 text-white py-2 px-4 rounded shadow mt-4">
            Restart Quiz
        </button>
    `;
}
