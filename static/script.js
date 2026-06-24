function bukaForm() {

    document.getElementById('menuUtama')
        .classList.add('hidden');

    document.getElementById('formHitung')
        .classList.remove('hidden');

    document.getElementById('hasilBox')
        .style.display = 'none';
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

function bukaFormConverter() {

    document.getElementById('menuUtama')
        .classList.add('hidden');

    document.getElementById('formConverter')
        .classList.remove('hidden');

    document.getElementById('hasilConverter')
        .style.display = 'none';
}


function kembaliMenuConverter() {

    document.getElementById('formConverter')
        .classList.add('hidden');

    document.getElementById('menuUtama')
        .classList.remove('hidden');

    document.getElementById('nilaiKonversi')
        .value = '';
}


async function hitungKonversi() {

    try {

        const kategori =
            document.getElementById(
                'kategoriKonversi'
            ).value;

        let dari;
        let ke;

        if (kategori === 'tegangan') {

            dari =
                document.getElementById(
                    'teganganDari'
                ).value;

            ke =
                document.getElementById(
                    'teganganKe'
                ).value;
        }

        else if (kategori === 'arus') {

            dari =
                document.getElementById(
                    'arusDari'
                ).value;

            ke =
                document.getElementById(
                    'arusKe'
                ).value;
        }

        else if (kategori === 'hambatan') {

            dari =
                document.getElementById(
                    'hambatanDari'
                ).value;

            ke =
                document.getElementById(
                    'hambatanKe'
                ).value;
        }

        else if (kategori === 'kapasitansi') {

            dari =
                document.getElementById(
                    'kapasitansiDari'
                ).value;

            ke =
                document.getElementById(
                    'kapasitansiKe'
                ).value;
        }

        else {

            dari =
                document.getElementById(
                    'frekuensiDari'
                ).value;

            ke =
                document.getElementById(
                    'frekuensiKe'
                ).value;
        }

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
        }

        else {

            document.getElementById(
                'hasilKonversiText'
            ).innerHTML =

                `<b>Nilai Awal:</b> ${nilaiAwal} ${dari}<br>
                 <b>Hasil:</b> ${hasil.hasil} ${ke}`;
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

function tampilkanKategoriConverter() {

    const kategori =
        document.getElementById(
            'kategoriKonversi'
        ).value;

    const semuaKategori = [

        'teganganBox',
        'arusBox',
        'hambatanBox',
        'kapasitansiBox',
        'frekuensiBox'
    ];

    semuaKategori.forEach(id => {

        document.getElementById(id)
            .classList.add('hidden');
    });

    if (kategori === 'tegangan') {

        document.getElementById(
            'teganganBox'
        ).classList.remove('hidden');
    }

    if (kategori === 'arus') {

        document.getElementById(
            'arusBox'
        ).classList.remove('hidden');
    }

    if (kategori === 'hambatan') {

        document.getElementById(
            'hambatanBox'
        ).classList.remove('hidden');
    }

    if (kategori === 'kapasitansi') {

        document.getElementById(
            'kapasitansiBox'
        ).classList.remove('hidden');
    }

    if (kategori === 'frekuensi') {

        document.getElementById(
            'frekuensiBox'
        ).classList.remove('hidden');
    }
}

document.addEventListener(
    'DOMContentLoaded',
    () => {

        if (
            document.getElementById(
                'kategoriKonversi'
            )
        ) {

            tampilkanKategoriConverter();
        }
    }
);