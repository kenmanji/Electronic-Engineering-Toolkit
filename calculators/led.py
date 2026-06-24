import math


def resistor_standar_terdekat(nilai):

    e12 = [
        1.0, 1.2, 1.5, 1.8,
        2.2, 2.7, 3.3, 3.9,
        4.7, 5.6, 6.8, 8.2
    ]

    if nilai <= 0:
        return 0

    eksponen = math.floor(math.log10(nilai))

    basis = nilai / (10 ** eksponen)

    terdekat = e12[0]

    for v in e12:

        if abs(v - basis) < abs(terdekat - basis):

            terdekat = v

    hasil = terdekat * (10 ** eksponen)

    return hasil


def hitung_led(
    v_sumber,
    v_led,
    jumlah_led,
    i_led,
    konfigurasi
):

    # Konfigurasi LED

    if konfigurasi == "seri":

        total_vled = v_led * jumlah_led
        total_arus = i_led

    else:

        total_vled = v_led
        total_arus = i_led * jumlah_led

    # Validasi

    if v_sumber <= total_vled:

        return {
            "error": "Tegangan sumber tidak cukup untuk menyalakan LED."
        }

    # Konversi mA ke A

    arus_ampere = total_arus / 1000

    # Tegangan pada resistor

    vr = v_sumber - total_vled

    # Nilai resistor

    resistor = vr / arus_ampere

    resistor_standar = resistor_standar_terdekat(
        resistor
    )

    # Daya resistor (Watt)

    daya = vr * arus_ampere

    # Faktor keamanan 2x

    daya_aman = daya * 2

    # Rating resistor yang disarankan

    if daya_aman <= 0.25:

        watt = 0.25

    elif daya_aman <= 0.5:

        watt = 0.5

    elif daya_aman <= 1:

        watt = 1

    elif daya_aman <= 2:

        watt = 2

    elif daya_aman <= 3:

        watt = 3

    elif daya_aman <= 5:

        watt = 5

    else:

        watt = 10

    return {

        "vled_total":
        round(total_vled, 2),

        "arus_total":
        round(total_arus, 1),

        "vr":
        round(vr, 3),

        "resistor":
        round(resistor, 2),

        "resistor_standar":
        round(resistor_standar, 2),

        "daya":
        round(daya * 1000, 2),

        "watt":
        watt

    }