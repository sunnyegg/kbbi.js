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
  try {
    const hasil = await cari(argv[0]); // fetch data dari url berdasarkan input

    const $ = cheerio.load(hasil); // init cheerio

    const hasilPencarian = $('h2').text(); // hasil kata
    const hasilDefinisi = []; // hasil definisi dari kata

    $('ol')
      .find('li')
      .each((index, element) => {
        const definisi = $(element)
          .text()
          .trim();

        hasilDefinisi[index] = { definisi }; // masukkan hasil ke array
      });

    console.log('');
    console.log(hasilPencarian);
    hasilDefinisi.map((value, index) => {
      console.log(index + 1 + ': ' + value.definisi);
    });
    console.log('');
  } catch (err) {
    console.log(err);
  }
})();
