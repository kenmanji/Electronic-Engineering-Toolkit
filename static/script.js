function bukaForm() {

     tutupSemuaForm();

    document.getElementById('menuUtama')
        .classList.add('hidden');

    document.getElementById('formHitung')
        .classList.remove('hidden');

    document.getElementById('hasilBox')
        .style.display = 'none';
}

function tutupSemuaForm(){

    document.getElementById("formHitung")
            .classList.add("hidden");

    document.getElementById("formLed")
            .classList.add("hidden");

    document.getElementById("formConverter")
            .classList.add("hidden");
}

function kembaliMenu() {

    document.getElementById('formHitung')
        .classList.add('hidden');

    document.getElementById('menuUtama')
        .classList.remove('hidden');

    document.getElementById('divVertikal').value = '';
    document.getElementById('voltPerDiv').value = '';
    document.getElementById('divHorizontal').value = '';
    document.getElementById('timePerDiv').value = '';

    document.getElementById('jenisGelombang').value =
        'sinus';
}

function bukaFormLed() {

     tutupSemuaForm();

    document.getElementById('menuUtama')
        .classList.add('hidden');

    document.getElementById('formLed')
        .classList.remove('hidden');

    document.getElementById('hasilLedBox')
        .style.display = 'none';
}

function kembaliMenuLed() {

    document.getElementById('formLed')
        .classList.add('hidden');

    document.getElementById('menuUtama')
        .classList.remove('hidden');

    document.getElementById('vSumber').value = '';

    document.getElementById('warnaLed').value =
        '2.0';

    document.getElementById('vLedManual').value =
        '';

    document.getElementById('jumlahLed').value =
        '1';

    document.getElementById('iLed').value =
        '20';

    document.getElementById('iLedCustom').value =
        '';

    document.getElementById('vLedManualWrap')
        .classList.add('hidden');

    document.getElementById('iLedCustomWrap')
        .classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {

    const warnaLed =
        document.getElementById('warnaLed');

    warnaLed.addEventListener('change', () => {

        const wrap =
            document.getElementById(
                'vLedManualWrap');

        if (warnaLed.value === 'custom') {

            wrap.classList.remove(
                'hidden');

        } else {

            wrap.classList.add(
                'hidden');
        }
    });

    const iLedSelect =
        document.getElementById('iLed');

    iLedSelect.addEventListener('change', () => {

        const wrap =
            document.getElementById(
                'iLedCustomWrap');

        if (iLedSelect.value === 'custom') {

            wrap.classList.remove(
                'hidden');

        } else {

            wrap.classList.add(
                'hidden');
        }
    });
});

function formatOhm(nilai) {

    if (nilai >= 1000000) {

        return (
            nilai / 1000000
        ).toFixed(2) + ' MΩ';
    }

    if (nilai >= 1000) {

        return (
            nilai / 1000
        ).toFixed(2) + ' kΩ';
    }

    return nilai.toFixed(2) + ' Ω';
}

async function hitungOsiloskop() {

    try {

        const response =
            await fetch(
                '/api/oscilloscope',
                {

                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body: JSON.stringify({

                        divVertikal:
                            document.getElementById(
                                'divVertikal'
                            ).value,

                        voltPerDiv:
                            document.getElementById(
                                'voltPerDiv'
                            ).value,

                        divHorizontal:
                            document.getElementById(
                                'divHorizontal'
                            ).value,

                        timePerDiv:
                            document.getElementById(
                                'timePerDiv'
                            ).value,

                        jenisGelombang:
                            document.getElementById(
                                'jenisGelombang'
                            ).value
                    })
                });

        const hasil =
            await response.json();

        document.getElementById('rJenis')
            .innerText =
            hasil.jenis;

        document.getElementById('rVp')
            .innerText =
            hasil.vp + ' V';

        document.getElementById('rVpp')
            .innerText =
            hasil.vpp + ' V';

        document.getElementById('rVrms')
            .innerText =
            hasil.vrms + ' V';

        if (
            document.getElementById(
                'rVavg'
            )
        ) {

            document.getElementById(
                'rVavg'
            ).innerText =
                hasil.vavg + ' V';
        }

        document.getElementById('rT')
            .innerText =
            hasil.periode + ' s';

        document.getElementById('rF')
            .innerText =
            hasil.frekuensi + ' Hz';

        document.getElementById(
            'hasilBox'
        ).style.display = 'block';

    } catch (error) {

        alert(
            'Terjadi kesalahan saat menghitung osiloskop.'
        );

        console.error(error);
    }
}

async function hitungResistorLed() {

    try {

        let vLed;

        if (
            document.getElementById(
                'warnaLed'
            ).value === 'custom'
        ) {

            vLed =
                document.getElementById(
                    'vLedManual'
                ).value;

        } else {

            vLed =
                document.getElementById(
                    'warnaLed'
                ).value;
        }

        let arusLed;

        if (
            document.getElementById(
                'iLed'
            ).value === 'custom'
        ) {

            arusLed =
                document.getElementById(
                    'iLedCustom'
                ).value;

        } else {

            arusLed =
                document.getElementById(
                    'iLed'
                ).value;
        }

        const response =
            await fetch(
                '/api/led',
                {

                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body: JSON.stringify({

                        vSumber:
                            document.getElementById(
                                'vSumber'
                            ).value,

                        vLed:
                            vLed,

                        jumlahLed:
                            document.getElementById(
                                'jumlahLed'
                            ).value,

                        iLed:
                            arusLed,

                        konfig:
                            document.getElementById(
                                'konfigLed'
                            ).value
                    })
                });

        const hasil =
            await response.json();

        if (hasil.error) {

            const warning =
                document.getElementById(
                    'peringatanLed'
                );

            warning.innerText =
                hasil.error;

            warning.style.display =
                'block';

            return;
        }

        document.getElementById(
            'peringatanLed'
        ).style.display =
            'none';

        document.getElementById(
            'rVledTotal'
        ).innerText =
            hasil.vled_total + ' V';

        document.getElementById(
            'rITotal'
        ).innerText =
            hasil.arus_total + ' mA';

        document.getElementById(
            'rVr'
        ).innerText =
            hasil.vr + ' V';

        document.getElementById(
            'rR'
        ).innerText =
            formatOhm(
                hasil.resistor
            );

        document.getElementById(
            'rRStandar'
        ).innerText =
            formatOhm(
                hasil.resistor_standar
            );

        document.getElementById(
            'rP'
        ).innerText =
            hasil.daya + ' mW';

        document.getElementById(
            'rWatt'
        ).innerText =
            hasil.watt + ' Watt';

        document.getElementById(
            'hasilLedBox'
        ).style.display =
            'block';

    } catch (error) {

        alert(
            'Terjadi kesalahan saat menghitung LED.'
        );

        console.error(error);
    }
}

/* ===================================================
   CONVERTER — prefiks SI lengkap (Yotta s/d Yocto)
   Daftar satuan tidak lagi di-hardcode; dibuat otomatis
   dari tabel prefiks SI agar sinkron dengan backend
   (lihat converter.py: PREFIKS_SI / URUTAN_PREFIKS).
=================================================== */

// Satuan dasar per kategori (harus sama persis dengan backend)
const SATUAN_DASAR = {
    tegangan:    'V',
    arus:        'A',
    hambatan:    'Ω',
    kapasitansi: 'F',
    frekuensi:   'Hz'
};

// Nama panjang satuan dasar (untuk label dropdown)
const NAMA_SATUAN_DASAR = {
    'V':  'Volt',
    'A':  'Ampere',
    'Ω':  'Ohm',
    'F':  'Farad',
    'Hz': 'Hertz'
};

// Urutan prefiks SI dari terbesar (yotta) ke terkecil (yocto)
const URUTAN_PREFIKS = [
    { p: 'Y',  n: 'yotta' },
    { p: 'Z',  n: 'zetta' },
    { p: 'E',  n: 'exa'   },
    { p: 'P',  n: 'peta'  },
    { p: 'T',  n: 'tera'  },
    { p: 'G',  n: 'giga'  },
    { p: 'M',  n: 'mega'  },
    { p: 'k',  n: 'kilo'  },
    { p: 'h',  n: 'hecto' },
    { p: 'da', n: 'deca'  },
    { p: '',   n: ''      },
    { p: 'd',  n: 'deci'  },
    { p: 'c',  n: 'centi' },
    { p: 'm',  n: 'mili'  },
    { p: 'u',  n: 'mikro' }, // ditampilkan sebagai µ
    { p: 'n',  n: 'nano'  },
    { p: 'p',  n: 'piko'  },
    { p: 'f',  n: 'femto' },
    { p: 'a',  n: 'atto'  },
    { p: 'z',  n: 'zepto' },
    { p: 'y',  n: 'yokto' }
];

/**
 * Menghasilkan daftar satuan (value + label) untuk sebuah kategori,
 * dari yotta sampai yocto, mengikuti urutan terbesar -> terkecil.
 */
function buatDaftarSatuan(kategori) {

    const dasar = SATUAN_DASAR[kategori];
    const namaDasar = NAMA_SATUAN_DASAR[dasar] || dasar;

    return URUTAN_PREFIKS.map(({ p, n }) => {

        const simbolTampil = (p === 'u') ? `µ${dasar}` : `${p}${dasar}`;

        const label = (p === '')
            ? `${simbolTampil} (${namaDasar})`
            : `${simbolTampil} (${n} ${namaDasar})`;

        return { value: simbolTampil, label };
    });
}

/**
 * Mengubah simbol satuan (misal 'kHz', 'dHz', 'µA', 'MΩ') menjadi
 * label kepanjangannya, contoh: 'kHz' -> '(kilo Hertz)', 'Hz' -> '(Hertz)'.
 * Dicari dengan mencocokkan akhiran satuan dasar lalu sisanya
 * dicocokkan ke tabel prefiks.
 */
function namaLengkapSatuan(satuan) {

    const satuanNorm = satuan.replace('µ', 'u');

    // cari satuan dasar mana yang cocok sebagai akhiran
    let dasarCocok = null;

    for (const kategori in SATUAN_DASAR) {
        const dasar = SATUAN_DASAR[kategori];
        if (satuanNorm.endsWith(dasar)) {
            if (!dasarCocok || dasar.length > dasarCocok.length) {
                dasarCocok = dasar;
            }
        }
    }

    if (!dasarCocok) {
        return `(${satuan})`;
    }

    const prefiksSimbol = satuanNorm.slice(0, satuanNorm.length - dasarCocok.length);
    const namaDasar = NAMA_SATUAN_DASAR[dasarCocok] || dasarCocok;

    const entriPrefiks = URUTAN_PREFIKS.find(({ p }) => p === prefiksSimbol);

    if (!entriPrefiks) {
        return `(${satuan})`;
    }

    return entriPrefiks.p === ''
        ? `(${namaDasar})`
        : `(${entriPrefiks.n} ${namaDasar})`;
}

/**
 * Memformat angka hasil konversi agar tetap rapi di kotak hasil.
 * Jika angka terlalu besar, terlalu kecil, atau representasi
 * desimalnya terlalu panjang, ditampilkan dalam notasi ilmiah
 * (mis. 1.23 × 10⁸) alih-alih angka panjang biasa.
 * Mengembalikan HTML (pakai <sup> untuk eksponen), bukan teks polos.
 */
function formatAngkaHasil(angka) {

    const n = Number(angka);

    if (Number.isNaN(n)) {
        return String(angka);
    }

    if (n === 0) {
        return '0';
    }

    const absN = Math.abs(n);
    const representasiBiasa = String(angka);

    // Pakai notasi ilmiah jika angka sangat besar/kecil, atau
    // representasi desimal biasanya terlalu panjang untuk kotak hasil.
    const perluNotasiIlmiah =
        absN >= 1e9 ||
        absN < 1e-6 ||
        representasiBiasa.replace('-', '').length > 12;

    if (!perluNotasiIlmiah) {
        return representasiBiasa;
    }

    const eksponen = Math.floor(Math.log10(absN));
    const mantissa = n / Math.pow(10, eksponen);

    // Bulatkan mantissa ke 3 desimal, buang nol di belakang yang tidak perlu
    const mantissaStr = parseFloat(mantissa.toFixed(3)).toString();

    return `${mantissaStr} × 10<sup>${eksponen}</sup>`;
}



function bukaFormConverter() {

     tutupSemuaForm();

    document.getElementById('menuUtama')
        .classList.add('hidden');

    document.getElementById('formConverter')
        .classList.remove('hidden');

    document.getElementById('hasilConverter')
        .style.display = 'none';

    pilihKategoriConverter('tegangan');
}


function kembaliMenuConverter() {

    document.getElementById('formConverter')
        .classList.add('hidden');

    document.getElementById('menuUtama')
        .classList.remove('hidden');

    document.getElementById('nilaiKonversi')
        .value = '';

    document.getElementById('hasilNilaiAwal').innerText = '-';
    document.getElementById('hasilNilaiAkhir').innerText = '-';
    document.getElementById('hasilSatuanAwalLabel').innerHTML = '&nbsp;';
    document.getElementById('hasilSatuanTujuanLabel').innerHTML = '&nbsp;';
}


/**
 * Mengisi dropdown "Satuan Awal" dan "Satuan Tujuan"
 * berdasarkan kategori yang aktif (otomatis yotta s/d yocto).
 */
function pilihKategoriConverter(kategori) {

    kategoriAktifConverter = kategori;

    // sinkronkan select kategori tersembunyi (kompatibilitas)
    const kategoriSelect = document.getElementById('kategoriKonversi');
    if (kategoriSelect) {
        kategoriSelect.value = kategori;
    }

    // tandai kartu kategori yang aktif
    document.querySelectorAll('.conv-cat-card').forEach(card => {
        card.classList.toggle('active', card.dataset.kategori === kategori);
    });

    const daftarSatuan = buatDaftarSatuan(kategori);

    // isi dropdown satuan awal
    const satuanAwalSelect = document.getElementById('satuanAwal');
    satuanAwalSelect.innerHTML = daftarSatuan
        .map(s => `<option value="${s.value}">${s.label}</option>`)
        .join('');

    // isi dropdown satuan tujuan
    const satuanTujuanSelect = document.getElementById('satuanTujuan');
    satuanTujuanSelect.innerHTML = daftarSatuan
        .map(s => `<option value="${s.value}">${s.label}</option>`)
        .join('');

    // default: satuan awal = posisi "kilo" (lebih umum dipakai), satuan tujuan = satuan dasar
    const idxKilo = daftarSatuan.findIndex(s => s.value === `k${SATUAN_DASAR[kategori]}`);
    const idxDasar = daftarSatuan.findIndex(s => s.value === SATUAN_DASAR[kategori]);

    satuanAwalSelect.selectedIndex = idxKilo >= 0 ? idxKilo : 0;
    satuanTujuanSelect.selectedIndex = idxDasar >= 0 ? idxDasar : 0;
}


async function hitungKonversi() {

    try {

        const dari = document.getElementById('satuanAwal').value;
        const ke = document.getElementById('satuanTujuan').value;

        const nilaiAwal =
            document.getElementById(
                'nilaiKonversi'
            ).value;

        const response =
            await fetch('/api/converter', {

                method: 'POST',

                headers: {
                    'Content-Type':
                    'application/json'
                },

                body: JSON.stringify({

                    nilai: nilaiAwal,
                    dari: dari,
                    ke: ke
                })
            });

        const hasil =
            await response.json();

        if (hasil.error) {

            document.getElementById(
                'hasilKonversiText'
            ).innerText =
                hasil.error;

            document.getElementById('hasilNilaiAwal').innerText = '-';
            document.getElementById('hasilNilaiAkhir').innerText = hasil.error;
            document.getElementById('hasilSatuanAwalLabel').innerHTML = '&nbsp;';
            document.getElementById('hasilSatuanTujuanLabel').innerHTML = '&nbsp;';
        }

        else {

            const hasilFormatted = formatAngkaHasil(hasil.hasil);
            const nilaiAwalFormatted = formatAngkaHasil(nilaiAwal);

            document.getElementById(
                'hasilKonversiText'
            ).innerHTML =

                `<b>Nilai Awal:</b> ${nilaiAwal} ${dari}<br>
                 <b>Hasil:</b> ${hasil.hasil} ${ke}`;

            document.getElementById('hasilNilaiAwal').innerHTML = `${nilaiAwalFormatted} ${dari}`;
            document.getElementById('hasilNilaiAkhir').innerHTML = `${hasilFormatted} ${ke}`;

            document.getElementById('hasilSatuanAwalLabel').innerText = namaLengkapSatuan(dari);
            document.getElementById('hasilSatuanTujuanLabel').innerText = namaLengkapSatuan(ke);
        }

        document.getElementById(
            'hasilConverter'
        ).style.display = 'block';

    } catch (error) {

        alert(
            'Terjadi kesalahan saat konversi.'
        );

        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.conv-cat-card').forEach(card => {
        card.addEventListener('click', () => {
            pilihKategoriConverter(card.dataset.kategori);
        });
    });
});