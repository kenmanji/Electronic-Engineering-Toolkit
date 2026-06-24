import math


def hitung_osiloskop(
        div_vertikal,
        volt_per_div,
        div_horizontal,
        time_per_div,
        jenis_gelombang):

    # Tegangan Peak
    vp = div_vertikal * volt_per_div
    vpp = vp * 2

    # Tegangan RMS berdasarkan jenis gelombang

    if jenis_gelombang == "kotak":

        vrms = vp
        vavg = vp


    elif jenis_gelombang == "segitiga":

        vrms = vp / math.sqrt(3)
        vavg = vp / 2

    elif jenis_gelombang == "sawtooth":

        vrms = vp / math.sqrt(3)
        vavg = vp / 2


    else:
        # sinus
        vrms = vp / math.sqrt(2)
        vavg = 0.637 * vp

    # Periode

    periode = div_horizontal * time_per_div

    # Frekuensi

    if periode == 0:
        frekuensi = 0
    else:
        frekuensi = 1 / periode

    return {

        "vp": round(vp, 4),

        "vpp": round(vpp, 4),

        "vrms": round(vrms, 4),

        "vavg": round(vavg, 4),

        "periode": round(periode, 6),

        "frekuensi": round(frekuensi, 4),

        "jenis": jenis_gelombang

    }