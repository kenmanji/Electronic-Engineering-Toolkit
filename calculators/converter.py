# ============================================================
# CONVERTER — Generik berbasis prefiks SI (Yotta s/d Yocto)
# ============================================================
#
# Pendekatan: setiap satuan dipecah menjadi (prefiks, satuan_dasar).
# Faktor konversi dihitung dari tabel prefiks SI, bukan di-hardcode
# per satuan. Ini membuat semua kategori otomatis mendukung
# seluruh rentang prefiks (Y, Z, E, P, T, G, M, k, h, da, "", d, c,
# m, u/µ, n, p, f, a, z, y) tanpa perlu menambah entri satu per satu.

# Tabel prefiks SI: simbol -> faktor pengali terhadap satuan dasar
PREFIKS_SI = {
    "Y": 1e24,   # yotta
    "Z": 1e21,   # zetta
    "E": 1e18,   # exa
    "P": 1e15,   # peta
    "T": 1e12,   # tera
    "G": 1e9,    # giga
    "M": 1e6,    # mega
    "k": 1e3,    # kilo
    "h": 1e2,    # hecto
    "da": 1e1,   # deca
    "":  1e0,    # (tanpa prefiks / satuan dasar)
    "d": 1e-1,   # deci
    "c": 1e-2,   # centi
    "m": 1e-3,   # milli
    "u": 1e-6,   # micro (ditulis "u" karena µ tidak dipakai sbg key)
    "n": 1e-9,   # nano
    "p": 1e-12,  # pico
    "f": 1e-15,  # femto
    "a": 1e-18,  # atto
    "z": 1e-21,  # zepto
    "y": 1e-24,  # yocto
}

# Nama lengkap prefiks (untuk label/tampilan, opsional dipakai backend lain)
NAMA_PREFIKS = {
    "Y": "yotta", "Z": "zetta", "E": "exa", "P": "peta", "T": "tera",
    "G": "giga", "M": "mega", "k": "kilo", "h": "hecto", "da": "deca",
    "": "", "d": "deci", "c": "centi", "m": "mili", "u": "mikro",
    "n": "nano", "p": "piko", "f": "femto", "a": "atto", "z": "zepto",
    "y": "yokto",
}

# Satuan dasar (base unit) untuk tiap kategori beserta simbolnya.
# key = nama kategori, value = (simbol_satuan_dasar, nama_kategori_tampilan)
SATUAN_DASAR = {
    "tegangan":    "V",
    "arus":        "A",
    "hambatan":    "Ω",
    "kapasitansi": "F",
    "frekuensi":   "Hz",
}

# Nama panjang satuan dasar (untuk label, misal "V" -> "Volt")
NAMA_SATUAN_DASAR = {
    "V":  "Volt",
    "A":  "Ampere",
    "Ω":  "Ohm",
    "F":  "Farad",
    "Hz": "Hertz",
}

# Urutan prefiks dari terbesar ke terkecil — dipakai untuk generate
# daftar satuan per kategori secara otomatis (yotta -> yocto).
URUTAN_PREFIKS = [
    "Y", "Z", "E", "P", "T", "G", "M", "k", "h", "da",
    "", "d", "c", "m", "u", "n", "p", "f", "a", "z", "y",
]


def _parse_satuan(satuan, satuan_dasar):
    """
    Memecah string satuan (misal 'kΩ', 'µA' / 'uA', 'MHz') menjadi
    prefiks SI-nya. Mengembalikan faktor pengali terhadap satuan dasar.
    Menerima 'µ' maupun 'u' sebagai micro untuk kompatibilitas input.
    """
    satuan = satuan.replace("µ", "u")

    if not satuan.endswith(satuan_dasar):
        raise ValueError(
            f"Satuan '{satuan}' tidak sesuai dengan satuan dasar '{satuan_dasar}'."
        )

    prefiks = satuan[: len(satuan) - len(satuan_dasar)]

    if prefiks not in PREFIKS_SI:
        raise ValueError(f"Prefiks '{prefiks}' tidak dikenali.")

    return PREFIKS_SI[prefiks]


def cari_kategori(satuan):
    """
    Mencari kategori yang cocok untuk satuan yang diberikan,
    berdasarkan satuan dasarnya (V, A, Ω, F, Hz).
    Mengembalikan None jika tidak ditemukan / tidak valid.
    """
    satuan_norm = satuan.replace("µ", "u")

    kandidat = None

    for kategori, dasar in SATUAN_DASAR.items():
        if satuan_norm.endswith(dasar):
            # Pilih kandidat dengan satuan dasar terpanjang yang cocok
            # (mencegah 'Hz' tertangkap sebagai akhiran dari satuan lain)
            if kandidat is None or len(dasar) > len(SATUAN_DASAR[kandidat]):
                prefiks = satuan_norm[: len(satuan_norm) - len(dasar)]
                if prefiks in PREFIKS_SI:
                    kandidat = kategori

    return kandidat


def daftar_satuan(kategori):
    """
    Menghasilkan daftar semua satuan valid (yotta s/d yocto) untuk
    sebuah kategori, lengkap dengan label tampilannya.
    Contoh hasil untuk 'tegangan': YV, ZV, ..., kV, V, mV, ..., yV
    """
    if kategori not in SATUAN_DASAR:
        raise ValueError(f"Kategori '{kategori}' tidak dikenali.")

    dasar = SATUAN_DASAR[kategori]
    nama_dasar = NAMA_SATUAN_DASAR.get(dasar, dasar)
    hasil = []

    for p in URUTAN_PREFIKS:
        simbol = f"{p}{dasar}"
        # Tampilan pakai µ untuk micro biar familiar secara notasi
        simbol_tampil = f"µ{dasar}" if p == "u" else simbol

        if p == "":
            label = f"{simbol_tampil} ({nama_dasar})"
        else:
            nama_prefiks = NAMA_PREFIKS[p]
            label = f"{simbol_tampil} ({nama_prefiks} {nama_dasar})"

        hasil.append({"value": simbol_tampil, "label": label})

    return hasil


def konversi(nilai, dari, ke):
    """
    Mengonversi `nilai` dari satuan `dari` ke satuan `ke`.
    Mendukung seluruh prefiks SI dari yotta (Y) sampai yocto (y)
    untuk kategori: tegangan (V), arus (A), hambatan (Ω),
    kapasitansi (F), dan frekuensi (Hz).

    Mengembalikan dict {"hasil": ...} jika berhasil,
    atau {"error": "..."} jika gagal.
    """
    try:
        nilai = float(nilai)
    except (TypeError, ValueError):
        return {"error": "Nilai harus berupa angka."}

    kategori_dari = cari_kategori(dari)
    kategori_ke = cari_kategori(ke)

    if kategori_dari is None:
        return {"error": f"Satuan '{dari}' tidak dikenali."}

    if kategori_ke is None:
        return {"error": f"Satuan '{ke}' tidak dikenali."}

    if kategori_dari != kategori_ke:
        return {"error": "Satuan tidak sejenis."}

    satuan_dasar = SATUAN_DASAR[kategori_dari]

    try:
        faktor_dari = _parse_satuan(dari, satuan_dasar)
        faktor_ke = _parse_satuan(ke, satuan_dasar)
    except ValueError as e:
        return {"error": str(e)}

    nilai_dasar = nilai * faktor_dari
    hasil = nilai_dasar / faktor_ke

    return {"hasil": _bulatkan_signifikan(hasil, 12)}


def _bulatkan_signifikan(angka, digit):
    """
    Membulatkan ke `digit` angka signifikan (bukan `digit` angka
    desimal tetap), supaya nilai yang sangat besar (1e+48) atau
    sangat kecil (1e-24) tidak hilang presisinya jadi 0 atau dipotong
    seperti yang terjadi dengan round() biasa.
    """
    if angka == 0:
        return 0.0

    from math import log10, floor

    eksponen = floor(log10(abs(angka)))
    faktor = 10 ** (digit - 1 - eksponen)

    hasil_bulat = round(angka * faktor) / faktor

    # Hilangkan noise floating-point (misal 9.999999999999999e+47
    # yang seharusnya 1e+48) dengan membulatkan ulang via representasi
    # string pada presisi `digit` angka signifikan.
    return float(f"{hasil_bulat:.{digit}g}")


# ============================================================
# Contoh pemakaian / smoke test manual
# ============================================================
if __name__ == "__main__":
    print(konversi(1, "kV", "V"))          # {'hasil': 1000.0}
    print(konversi(1, "MHz", "Hz"))        # {'hasil': 1000000.0}
    print(konversi(1, "YV", "yV"))         # nilai sangat besar
    print(konversi(1, "pF", "F"))          # {'hasil': 1e-12}
    print(konversi(5, "V", "A"))           # {'error': 'Satuan tidak sejenis.'}
    print(daftar_satuan("tegangan"))