let detik = 0;
        let ronde = 1;
        const maxRonde = 5;
        let questions = [];
        let kolomUtama = [];
        let countdown;
        let currentQuestionIndex = 0;
        let rondeResults = [];

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
                .map((h) => ` <div class="flex justify-center items-center p-4 bg-white text-center font-medium text-lg border rounded shadow">${h}</div>`)
                .join('');
        }

        function tampilkanSoal(index) {
            const soalContainer = document.getElementById("soal-container");
            const { kolomKedua } = questions[index];

            soalContainer.innerHTML = ` 
                <div class="border p-4 rounded shadow-md bg-gray-50">
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
                .map((h) => `<div class="p-2 bg-gray-200 text-center font-bold text-xl">${h}</div>`)
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
                    class="p-2 bg-gray-300 text-center font-bold text-sm cursor-pointer hover:bg-gray-400">
                    ${option.urutan}
                </button>`
            ).join('');
        }

        function pilihHuruf(jawabanBenar, jawabanPilih, index) {
            questions[index].chosenAnswer = jawabanPilih;

            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                tampilkanSoal(currentQuestionIndex);
            } else {
                clearInterval(countdown);
                endRound();
            }
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
                ${rondeResults.map((result, index) => `
                    <div class="border p-4 rounded shadow-md bg-gray-50 mb-4">
                        <h3 class="font-semibold mb-2">Ronde ${index + 1}</h3>
                        <p>Benar: ${result.benar}</p>
                        <p>Salah: ${result.salah}</p>
                        <p>Tidak Terjawab: ${result.tidakTerjawab}</p>
                    </div>
                `).join('')}
            `;
        }

        buatSoal();
        tampilkanKolomUtama();
        tampilkanSoal(currentQuestionIndex);
        startTimer();