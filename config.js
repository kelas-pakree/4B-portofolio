// ============================================================
// KONFIGURASI — Kelas Pakree (4B MI Safinatul Huda)
// ============================================================
// Setelah Apps Script di-deploy sebagai Web App (lihat PANDUAN-SETUP.md),
// tempel URL-nya di bawah ini. Selama masih kosong, website akan
// menampilkan DATA CONTOH supaya tampilan tetap bisa dilihat/diuji.

const CONFIG = {
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbwakoNVd9kDokPWnJqmLHQloR1zP8b3uV4M2iaOXT7TegeUgF-1eFc96IfRAdnR-5C6GA/exec", // contoh: "https://script.google.com/macros/s/xxxxxxxx/exec"

  IDENTITAS: {
    namaSekolah: "MI SAFINATUL HUDA",
    kelas: "4B",
    lokasi: "Sowan Kidul, Kedung, Jepara",
    tahunAjaran: "2026/2027"
  },

  MAPEL: [
    { nama: "Pendidikan Pancasila", warna: "#C0392B" },
    { nama: "Bahasa Indonesia",     warna: "#3E7CB1" },
    { nama: "Matematika",           warna: "#5B8C3A" },
    { nama: "IPAS",                 warna: "#E07A29" },
    { nama: "Kesenian",             warna: "#8E5DA8" },
    { nama: "Bahasa Jawa",          warna: "#9C6B3E" },
    { nama: "Bahasa Inggris",       warna: "#1F9E9E" },
    { nama: "Ke-NU-an",             warna: "#0B6E4F" }
  ],

  // Mapel dengan menu tambahan khusus
  APLIKASI_TAMBAHAN: {
    "Bahasa Inggris": {
      label: "🔊 Belajar Kosakata (Audio Inggris)",
      deskripsi: "Latihan pengucapan kata & kalimat Inggris-Indonesia, bisa dipakai offline setelah dibuka sekali.",
      url: "https://paxree.github.io/audio-inggris-kelas-pakree/"
    }
  },
  MAPEL_DENGAN_FASHOLATAN: ["Ke-NU-an"]
};
