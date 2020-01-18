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
    const hasilPencarian = $('h2').text();
    // hasil definisi kata
    const hasilDefinisi = [];
    // hasil jenis kata
    const jenisKataDefinisi = [];

    // jika entri tidak ditemukan
    const tidakDitemukan = $('.body-content')
      .clone()
      .children('h4')
      .first()
      .text()
      .trim();

    if (tidakDitemukan === 'Entri tidak ditemukan.') {
      return console.log(tidakDitemukan);
    }

    // proses mengambil data
    $('ol > li').each((i, el) => {
      const definisi = $(el)
        .clone()
        .children()
        .remove()
        .end()
        .text();

      const jenis = $(el)
        .clone()
        .children()
        .first()
        .text()
        .trim()
        .split(/\W+/);

      $(el)
        .clone()
        .find('span')
        .each((i, el) => {
          const definisiJenis = $(el).attr('title');

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

    // hilangkan duplikat
    const filter = Array.from(new Set(jenisKataDefinisi));

    // tampilkan hasil
    console.log(hasilPencarian);
    hasilDefinisi.map((value, index) => {
      console.log(`${index + 1}: (${value.jenis}) ${value.definisi} ${value.contoh}`);
    });
    console.log('');
    filter.map((val) => {
      console.log(val);
    });
  } catch (err) {
    // jika error terjadi
    console.log(err);
  }
})();
