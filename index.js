// import
const axios = require('axios').default;
const cheerio = require('cheerio');

// declarations
const kbbi_url = 'https://kbbi.kemdikbud.go.id/';
const argv = process.argv.slice(2);

// functions
const cari = async (katakunci) => {
  const hasil = await axios.get(`${kbbi_url}entri/${katakunci}`);
  return hasil.data;
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
    const hasilPencarian = $('h2')
      .text()
      .trim();

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
    // untuk hasil total 1
    if ($('.adjusted-par').length) {
      const jenis = $('.adjusted-par > li')
        .children()
        .first()
        .text()
        .trim();

      const definisiJenis = $('.adjusted-par > li')
        .find('span')
        .attr('title');

      $('.adjusted-par > li')
        .children()
        .first()
        .remove();

      const definisi = $('.adjusted-par > li')
        .text()
        .trim();

      hasilDefinisi.push({ jenis, definisi });
      jenisKataDefinisi.push(definisiJenis);
    } else {
      // hasil lebih dari 1
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
    const definisi = hasilDefinisi
      .map((value, index) => {
        const output = `${index + 1}: (${value.jenis}) ${value.definisi} ${
          value.contoh ? value.contoh : ''
        }`;
        return output;
      })
      .join('\n');

    const jenis = filter
      .map((val) => {
        const output = `${val}`;
        return output;
      })
      .join('\n');

    // tampilkan hasil
    const output = {
      kata: hasilPencarian,
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
