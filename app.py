from flask import Flask, render_template, request, jsonify

from calculators.led import hitung_led
from calculators.oscilloscope import hitung_osiloskop
from calculators.converter import konversi

app = Flask(__name__)


@app.route('/')
def home():

    return render_template('index.html')


@app.route('/api/oscilloscope', methods=['POST'])
def oscilloscope():

    data = request.json

    hasil = hitung_osiloskop(

        float(data['divVertikal']),
        float(data['voltPerDiv']),
        float(data['divHorizontal']),
        float(data['timePerDiv']),
        data['jenisGelombang']

    )

    return jsonify(hasil)


@app.route('/api/led', methods=['POST'])
def led():

    data = request.json

    hasil = hitung_led(

        float(data['vSumber']),
        float(data['vLed']),
        int(data['jumlahLed']),
        float(data['iLed']),
        data['konfig']

    )

    return jsonify(hasil)


@app.route('/api/converter', methods=['POST'])
def converter():

    data = request.json

    hasil = konversi(

        float(data['nilai']),
        data['dari'],
        data['ke']

    )

    return jsonify(hasil)


if __name__ == '__main__':

    app.run(debug=True)