// import
const axios = require('axios').default;
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// declarations
const kbbi_url = 'https://kbbi.kemdikbud.go.id/';
const argv = process.argv.slice(2);

// functions
const cari = async katakunci => {
  let hasil;

  // cache
  const folder = path.resolve(__dirname, './.cache/');
  const file = path.resolve(__dirname, `${folder}/hasil-${katakunci}.html`);

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }

  if (!fs.existsSync(file)) {
    hasil = await axios.get(`${kbbi_url}entri/${katakunci}`);

    fs.writeFileSync(`${folder}/hasil-${katakunci}.html`, hasil.data);

    return hasil.data;
  }

  return fs.readFileSync(file);
};

// let's start
(async () => {
  // jika input kosong
  if (!argv.length) {
    return console.log('Tidak boleh kosong.');
  }

  try {
    // fetch data dari url berdasarkan input
    const hasil = await cari(argv[0]);

    // init cheerio
    const $ = cheerio.load(hasil);

    // hasil pencarian kata
    let hasilPencarian = {};
    const hasilKata = [];
    const hasilSilabel = [];

    const jumlahKata = $('h2').length;

    if (jumlahKata < 2) {
      hasilPencarian = $('h2')
        .text()
        .trim();
    } else {
      $('h2').each((i, el) => {
        const hasilPencarianSilabel = $(el)
          .children()
          .text()
          .trim();

        hasilSilabel.push(hasilPencarianSilabel);

        $(el)
          .children()
          .remove();

        const hasilPencarianKata = $(el)
          .text()
          .trim();

        hasilKata.push(hasilPencarianKata);
      });

      hasilKata.map((kata, i) => {
        hasilSilabel.map(silabel => {
          hasilPencarian['kata' + (i + 1)] = { kata, silabel };
        });
      });
    }

    // hasil definisi kata
    const hasilDefinisi = [];

    // hasil jenis kata
    const jenisKataDefinisi = [];

    // jika entri tidak ditemukan
    const tidakDitemukan = $('.body-content')
      .children('h4')
      .first()
      .text()
      .trim();

    if (tidakDitemukan === 'Entri tidak ditemukan.') {
      return console.log(tidakDitemukan);
    }

    // proses mengambil data
    // untuk kata memiliki 2 arti
    if ($('.adjusted-par').length) {
      $('.adjusted-par > li').each((i, el) => {
        const jenis = $(el)
          .children()
          .first()
          .text()
          .trim()
          .split(/\W+/);

        $(el)
          .find('span')
          .each((i, el) => {
            const definisiJenis = $(el)
              .attr('title')
              .trim();

            jenisKataDefinisi.push(definisiJenis);
          });

        $(el)
          .children()
          .first()
          .remove();

        const definisi = $(el)
          .text()
          .trim();

        $(el)
          .find('font:nth-child(1)')
          .remove();

        const contoh = $(el)
          .children()
          .text()
          .trim();

        hasilDefinisi.push({ jenis, definisi, contoh });
      });
    } else {
      // untuk kata memiliki 1 arti
      $('ol > li').each((i, el) => {
        const definisi = $(el)
          .clone()
          .children()
          .remove()
          .end()
          .text()
          .trim();

        const jenis = $(el)
          .children()
          .first()
          .text()
          .trim()
          .split(/\W+/);

        $(el)
          .find('span')
          .each((i, el) => {
            const definisiJenis = $(el)
              .attr('title')
              .trim();

            jenisKataDefinisi.push(definisiJenis);
          });

        $(el)
          .find('font:nth-child(1)')
          .remove();

        const contoh = $(el)
          .children()
          .text()
          .trim();

        // masukkan hasil ke array
        hasilDefinisi[i] = { jenis, definisi, contoh };
      });
    }

    // hilangkan duplikat
    const filter = Array.from(new Set(jenisKataDefinisi));

    // kumpulkan hasil
    let kata;

    if (jumlahKata > 1) {
      kata = Object.values(hasilPencarian)
        .map((value, index) => {
          const output = `${index + 1}: ${value.kata} ${value.silabel}`;

          return output;
        })
        .join('\n');
    } else {
      kata = hasilPencarian;
    }

    const definisi = hasilDefinisi
      .map((value, index) => {
        const output = `${index + 1}: (${value.jenis}) ${value.definisi} ${
          value.contoh ? value.contoh : ''
        }`;
        return output;
      })
      .join('\n');

    const jenis = filter
      .map(val => {
        const output = `${val}`;
        return output;
      })
      .join('\n');

    // tampilkan hasil
    const output = {
      kata: kata,
      definisi: definisi,
      jenis: jenis !== 'undefined' ? jenis : ''
    };

    console.log(output.kata + '\n');
    console.log(output.definisi + '\n');
    console.log(output.jenis);
  } catch (err) {
    // jika error terjadi
    console.log(err);
  }
})();
