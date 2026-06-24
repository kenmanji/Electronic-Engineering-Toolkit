def konversi(nilai, dari, ke):

    kategori = {

        # Tegangan
        "V": ("tegangan", 1),
        "mV": ("tegangan", 0.001),
        "kV": ("tegangan", 1000),

        # Arus
        "A": ("arus", 1),
        "mA": ("arus", 0.001),
        "uA": ("arus", 0.000001),

        # Hambatan
        "Ω": ("hambatan", 1),
        "kΩ": ("hambatan", 1000),
        "MΩ": ("hambatan", 1000000),

        # Kapasitansi
        "F": ("kapasitansi", 1),
        "mF": ("kapasitansi", 0.001),
        "uF": ("kapasitansi", 0.000001),
        "nF": ("kapasitansi", 0.000000001),
        "pF": ("kapasitansi", 0.000000000001),

        # Frekuensi
        "Hz": ("frekuensi", 1),
        "kHz": ("frekuensi", 1000),
        "MHz": ("frekuensi", 1000000)
    }

    if kategori[dari][0] != kategori[ke][0]:

        return {
            "error":
            "Satuan tidak sejenis."
        }

    nilai_dasar = nilai * kategori[dari][1]

    hasil = nilai_dasar / kategori[ke][1]

    return {

        "hasil":
        round(hasil, 12)
    }