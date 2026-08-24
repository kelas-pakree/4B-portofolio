// ============================================================
// Kelas Pakree — script.js
// Mengambil data dari Google Apps Script (lihat apps-script/Code.gs)
// Kalau CONFIG.APPS_SCRIPT_URL kosong / gagal diakses, dipakai DATA CONTOH
// supaya tampilan tetap bisa diuji sebelum backend dihubungkan.
// ============================================================

const BACKEND_READY = !!CONFIG.APPS_SCRIPT_URL;

async function apiGet(action, params = {}) {
  if (!BACKEND_READY) throw new Error("APPS_SCRIPT_URL belum diisi di config.js");
  const qs = new URLSearchParams({ action, ...params }).toString();
  const res = await fetch(`${CONFIG.APPS_SCRIPT_URL}?${qs}`);
  if (!res.ok) throw new Error("Gagal mengambil data: " + res.status);
  return res.json();
}

// ---------- DATA CONTOH (dipakai kalau backend belum siap) ----------
const CONTOH = {
  pengumuman: [
    { tanggal: "14 Agu 2026", isi: "Pengumpulan tugas Pendidikan Pancasila diperpanjang sampai Jumat." },
    { tanggal: "10 Agu 2026", isi: "Kuis Matematika Bab 3 dibuka Senin depan." }
  ],
  jadwal: [
    { jam: "07.00", senin: "Matematika", selasa: "B. Indonesia" },
    { jam: "08.30", senin: "IPAS", selasa: "Kesenian" },
    { jam: "10.00", senin: "Ke-NU-an", selasa: "B. Jawa" }
  ],
  piket: [
    { hari: "Senin", regu: "Regu 1 — Aisyah dkk" },
    { hari: "Selasa", regu: "Regu 2 — Fahri dkk" },
    { hari: "Rabu", regu: "Regu 3 — Nadia dkk" }
  ],
  materi: Array.from({ length: 10 }, (_, i) => ({
    bab: i + 1,
    files: [
      { jenis: "pdf", nama: `Ringkasan Materi Bab ${i + 1}`, url: "#" },
      { jenis: "pdf", nama: "Lembar Latihan Soal", url: "#" },
      { jenis: "gambar", nama: `Peta Konsep Bab ${i + 1}`, url: "#", thumb: "" }
    ],
    youtube: "https://youtube.com"
  })),
  tugas: [{ deskripsi: "Kerjakan latihan halaman 24–26 di buku tulis, dikumpulkan Jumat." }],
  kuis: [{ judul: "Kuis Bab 1 — 10 soal pilihan ganda", url: "#" }],
  fasholatan: [
    { judul: "Niat & Bacaan Wudhu", url: "#" },
    { judul: "Bacaan Sholat Fardhu", url: "#" },
    { judul: "Dzikir & Doa Setelah Sholat", url: "#" }
  ],
  galeri: [
    { album: "Lomba 17 Agustus", foto: [] },
    { album: "Praktik IPAS", foto: [] }
  ],
  siswa: {
    nama: "Ananda Fahri Ramadhan (CONTOH)",
    nilai: [
      { mapel: "Matematika", kuis: 88, tugas: 90 },
      { mapel: "Bahasa Indonesia", kuis: 92, tugas: 85 },
      { mapel: "IPAS", kuis: 80, tugas: 88 }
    ],
    absensi: { bulan: "Agustus 2026", hadir: 18, izin: 1, sakit: 0, alfa: 0 }
  }
};

async function getData(action, params, contohFallback) {
  if (!BACKEND_READY) return contohFallback;
  try {
    return await apiGet(action, params);
  } catch (e) {
    console.warn(`[${action}] pakai data contoh —`, e.message);
    return contohFallback;
  }
}

// ---------- RENDER: BERANDA ----------
async function renderBeranda() {
  const pengumumanBox = document.getElementById("pengumumanBox");
  const jadwalBox = document.getElementById("jadwalBox");
  const piketBox = document.getElementById("piketBox");

  const pengumuman = await getData("pengumuman", {}, CONTOH.pengumuman);
  pengumumanBox.innerHTML = pengumuman.length
    ? pengumuman.map(p => `<div class="announce"><div class="date">${p.tanggal}</div>${p.isi}</div>`).join("")
    : `<p class="empty-state">Belum ada pengumuman.</p>`;

  const jadwal = await getData("jadwal", {}, CONTOH.jadwal);
  jadwalBox.innerHTML = `<table><tr><th>Jam</th><th>Senin</th><th>Selasa</th></tr>${
    jadwal.map(j => `<tr><td class="mono">${j.jam}</td><td>${j.senin}</td><td>${j.selasa}</td></tr>`).join("")
  }</table>`;

  const piket = await getData("piket", {}, CONTOH.piket);
  piketBox.innerHTML = `<table><tr><th>Hari</th><th>Regu</th></tr>${
    piket.map(p => `<tr><td>${p.hari}</td><td>${p.regu}</td></tr>`).join("")
  }</table>`;
}

// ---------- RENDER: DAFTAR MAPEL ----------
function renderDaftarMapel() {
  const box = document.getElementById("mapelGrid");
  box.innerHTML = CONFIG.MAPEL.map(m =>
    `<button class="mapel-tab" style="background:${m.warna}" onclick="bukaMapel('${m.nama.replace(/'/g, "\\'")}')">${m.nama}</button>`
  ).join("");
}

// ---------- RENDER: DETAIL MAPEL ----------
async function bukaMapel(nama) {
  document.getElementById("mapelDetail").style.display = "block";
  document.getElementById("mapelName").textContent = nama;
  document.getElementById("mapelDetail").scrollIntoView({ behavior: "smooth" });

  // Materi (accordion per bab)
  const materiBox = document.getElementById("materiAccordion");
  materiBox.innerHTML = `<p class="loading-state">Memuat materi…</p>`;
  const materi = await getData("materi", { mapel: nama }, CONTOH.materi);
  materiBox.innerHTML = materi.map((bab, idx) => `
    <div class="bab-item ${idx === 0 ? "open" : ""}">
      <div class="bab-head" onclick="this.parentElement.classList.toggle('open')">
        <span>📁 Bab ${bab.bab}</span><span class="chev">▶</span>
      </div>
      <div class="bab-body">
        ${bab.files.map(f => `
          <div class="materi-row">
            <span style="display:flex;align-items:center;gap:8px;">
              ${f.jenis === "gambar" ? `<img class="thumb" src="${f.thumb || f.url}" loading="lazy" alt="">` : ""}
              <span><span class="pill">${f.jenis === "pdf" ? "PDF" : "Gambar"}</span> ${f.nama}</span>
            </span>
            <a href="${f.url}" target="_blank" rel="noopener">Lihat · Download</a>
          </div>`).join("")}
        ${bab.youtube ? `
          <div class="materi-row yt-row">
            <span>▶️ Video Penjelasan Bab ${bab.bab}</span>
            <a href="${bab.youtube}" target="_blank" rel="noopener">Tonton di YouTube ↗</a>
          </div>` : ""}
      </div>
    </div>`).join("");

  // Tugas
  const tugas = await getData("tugas", { mapel: nama }, CONTOH.tugas);
  document.getElementById("tugasBox").innerHTML = tugas.length
    ? tugas.map(t => `<p>📝 ${t.deskripsi}</p>`).join("")
    : `<p class="empty-state">Belum ada tugas untuk mapel ini.</p>`;

  // Kuis
  const kuis = await getData("kuis", { mapel: nama }, CONTOH.kuis);
  document.getElementById("kuisBox").innerHTML = kuis.length
    ? kuis.map(k => `<p>🧠 ${k.judul} <a href="${k.url}" target="_blank" rel="noopener" style="float:right;color:var(--chalk-green);">Kerjakan →</a></p>`).join("")
    : `<p class="empty-state">Belum ada kuis untuk mapel ini.</p>`;

  // Aplikasi tambahan (per-mapel)
  const extra = CONFIG.APLIKASI_TAMBAHAN[nama];
  const extraBox = document.getElementById("extraAppBox");
  if (extra) {
    extraBox.style.display = "block";
    extraBox.innerHTML = `
      <div class="section-title"><span class="dot"></span><h2>Aplikasi Tambahan</h2></div>
      <div class="card">
        <div><strong>${extra.label}</strong><p style="margin:4px 0 0;font-size:12.5px;color:var(--ink-soft);">${extra.deskripsi}</p></div>
        <a href="${extra.url}" target="_blank" rel="noopener" style="text-decoration:none;"><button class="primary" style="width:auto;">Buka Aplikasi ↗</button></a>
      </div>`;
  } else {
    extraBox.style.display = "none";
    extraBox.innerHTML = "";
  }

  // Fasholatan (khusus Ke-NU-an)
  const fasholatanBox = document.getElementById("fasholatanBox");
  if (CONFIG.MAPEL_DENGAN_FASHOLATAN.includes(nama)) {
    const fasholatan = await getData("fasholatan", {}, CONTOH.fasholatan);
    fasholatanBox.style.display = "block";
    fasholatanBox.innerHTML = `
      <div class="section-title"><span class="dot"></span><h2>Fasholatan</h2></div>
      <div class="card">
        ${fasholatan.map(f => `<p><span class="pill">Bacaan</span> ${f.judul} <a href="${f.url}" target="_blank" rel="noopener" style="float:right;color:var(--accent-sky);">Lihat · Download</a></p>`).join("")}
      </div>`;
  } else {
    fasholatanBox.style.display = "none";
    fasholatanBox.innerHTML = "";
  }
}

function tutupMapel() {
  document.getElementById("mapelDetail").style.display = "none";
}

// ---------- RENDER: CEK NILAI & ABSENSI ----------
async function cekNilai() {
  const kode = document.getElementById("kodeInput").value.trim();
  const hasilBox = document.getElementById("hasilDemo");
  if (!kode) return;
  hasilBox.style.display = "block";
  hasilBox.innerHTML = `<p class="loading-state">Mencari data…</p>`;

  const data = BACKEND_READY
    ? await getData("siswa", { kode }, null)
    : CONTOH.siswa;

  if (!data) {
    hasilBox.innerHTML = `<p class="empty-state">Kode tidak ditemukan. Pastikan kode sesuai yang diberikan wali kelas.</p>`;
    return;
  }

  hasilBox.innerHTML = `
    <h3 style="margin:0 0 8px;">Hasil — ${data.nama}</h3>
    <table><tr><th>Mapel</th><th>Nilai Kuis</th><th>Nilai Tugas</th></tr>
      ${data.nilai.map(n => `<tr><td>${n.mapel}</td><td class="mono">${n.kuis}</td><td class="mono">${n.tugas}</td></tr>`).join("")}
    </table>
    <h3 style="margin:18px 0 8px;">Rekap Absensi — ${data.absensi.bulan}</h3>
    <table><tr><th>Hadir</th><th>Izin</th><th>Sakit</th><th>Alfa</th></tr>
      <tr><td class="mono">${data.absensi.hadir}</td><td class="mono">${data.absensi.izin}</td><td class="mono">${data.absensi.sakit}</td><td class="mono">${data.absensi.alfa}</td></tr>
    </table>`;
}

// ---------- RENDER: GALERI ----------
async function renderGaleri() {
  const box = document.getElementById("galeriBox");
  const galeri = await getData("galeri", {}, CONTOH.galeri);
  box.innerHTML = galeri.map(album => `
    <h3 style="font-size:14.5px;">📁 ${album.album}</h3>
    <div class="gallery" style="margin-bottom:20px;">
      ${(album.foto.length ? album.foto : Array(3).fill({ url: "" })).map(f =>
        `<div class="photo">${f.url ? `<img src="${f.url}" loading="lazy" alt="">` : ""}</div>`
      ).join("")}
    </div>`).join("") || `<p class="empty-state">Belum ada album foto.</p>`;
}

// ---------- NAVIGASI TAB ----------
function showView(id, btn) {
  document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  tutupMapel();
}

// ---------- INIT ----------
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("logoSekolah").src = "logo-mi.png";
  document.querySelector(".w-name").nextSibling; // no-op guard
  document.getElementById("judulKelas").textContent = `${CONFIG.IDENTITAS.kelas} ${CONFIG.IDENTITAS.namaSekolah}`;
  document.getElementById("lokasiSekolah").textContent = CONFIG.IDENTITAS.lokasi;

  renderDaftarMapel();
  renderBeranda();
  renderGaleri();

  if (!BACKEND_READY) {
    console.info("ℹ️ APPS_SCRIPT_URL belum diisi di config.js — situs menampilkan DATA CONTOH.");
  }
});
