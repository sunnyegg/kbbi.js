# KBBI DARING

Proyek ini terinspirasi dari: https://github.com/aliakbars/kbbi

Sekaligus untuk saya belajar tentang Web Scraping.
Akan terus saya <i>update.</i>

## PENGENALAN

Ini adalah antarmuka teks untuk KBBI Daring: https://kbbi.kemdikbud.go.id/

## PEMASANGAN

Perintah berikut akan memasang semua dependensi:

```bash
$ npm install
```

## PENGGUNAAN

Berikut cara menggunakan aplikasi ini:

```bash
$ node index.js <kata kunci>
```

Contoh:

```bash
$ node index.js kerja
ker.ja /kêrja/
1: n        kegiatan melakukan sesuatu; yang dilakukan (diperbuat): --nya makan dan minum saja
2: n        sesuatu yang dilakukan untuk mencari nafkah; mata pencaharian: selama lima tahun --nya berdagang
3: n        perayaan yang berhubungan dengan perkawinan, khitanan, dan sebagainya; pesta perjamuan: -- nikah akan dilaksanakan pada tanggal10 Syawal
4: n cak       pekerjaan: menguli merupakan -- yang memerlukan tenagafisik
5: v cak       bekerja: hari ini ia tidak -- karena sakit
```

Jika ingin mencari kata dasar yang lebih dari satu kata, gunakan tanda petik.

Contoh:

```bash
$ node index.js "tanggung jawab"
tang.gung ja.wab
1: n        keadaan wajib menanggung segala sesuatunya (kalau terjadiapa-apa boleh dituntut, dipersalahkan, diperkarakan, dan sebagainya):pemogokan itu menjadi -- pemimpin serikat buruh
2: n    Huk    fungsi menerima pembebanan, sebagai akibat sikap pihaksendiri atau pihak lain
```
