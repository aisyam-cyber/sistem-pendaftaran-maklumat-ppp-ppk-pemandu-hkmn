/**
 * HOSPITAL KEMAMAN WORKFORCE & SUPERVISION INTELLIGENCE SYSTEM
 * MODUL: app.js (Pengurus Navigasi & Mod Aplikasi SPA Phase 8)
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("Aplikasi Hospital Kemaman Berjaya Diinisialisasi.");
});

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('active');
}

function tukarPaparanView(viewTerpilih) {
    const semuaMenu = document.querySelectorAll('.sidebar .nav-link');
    semuaMenu.forEach(m => m.classList.remove('active'));

    const viewJadual = document.getElementById('viewJadual');
    const viewDashboard = document.getElementById('viewDashboard');
    const viewLaporan = document.getElementById('viewLaporan');
    const tajukUtama = document.getElementById('tajukModulUtama');
    const penapisSkim = document.getElementById('penapisSkim');

    // Sembunyikan Semua View Terlebih Dahulu
    if (viewJadual) viewJadual.classList.add('d-none');
    if (viewDashboard) viewDashboard.classList.add('d-none');
    if (viewLaporan) viewLaporan.classList.add('d-none');

    if (viewTerpilih === 'DASHBOARD') {
        document.getElementById('menuDashboard')?.classList.add('active');
        if (viewDashboard) viewDashboard.classList.remove('d-none');
        muatDashboardAnalytics();
        return;
    }

    if (viewTerpilih === 'LAPORAN') {
        document.getElementById('menuLaporan')?.classList.add('active');
        if (viewLaporan) viewLaporan.classList.remove('d-none');
        return;
    }

    // Jika pilih menu Jadual
    if (viewJadual) viewJadual.classList.remove('d-none');

    if (viewTerpilih === 'INDUK') {
        document.getElementById('menuInduk')?.classList.add('active');
        if (tajukUtama) tajukUtama.innerText = "Pengurusan Induk Anggota";
        if (penapisSkim) penapisSkim.value = "";
        muatNaiikAnggota();
    } else if (viewTerpilih === 'PPP') {
        document.getElementById('menuPPP')?.classList.add('active');
        if (tajukUtama) tajukUtama.innerText = "Data Penolong Pegawai Perubatan (PPP)";
        if (penapisSkim) penapisSkim.value = "PPP";
        muatModulPPP();
    } else if (viewTerpilih === 'PPK') {
        document.getElementById('menuPPK')?.classList.add('active');
        if (tajukUtama) tajukUtama.innerText = "Data Pembantu Perawatan Kesihatan (PPK)";
        if (penapisSkim) penapisSkim.value = "PPK";
        muatModulPPK();
    } else if (viewTerpilih === 'PEMANDU') {
        document.getElementById('menuPemandu')?.classList.add('active');
        if (tajukUtama) tajukUtama.innerText = "Data Pemandu Kenderaan";
        if (penapisSkim) penapisSkim.value = "PEMANDU";
        muatModulPemandu();
    }
}
