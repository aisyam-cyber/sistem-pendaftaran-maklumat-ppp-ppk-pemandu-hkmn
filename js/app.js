/**
 * HOSPITAL KEMAMAN WORKFORCE & SUPERVISION INTELLIGENCE SYSTEM
 * MODUL: app.js (Pengurus Navigasi & Router Modul SPA)
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("Aplikasi Hospital Kemaman Berjaya Diinisialisasi.");
});

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('active');
}

function tukarPaparanView(viewTerpilih) {
    // 1. Nyahaktifkan semua menu di sidebar
    const semuaMenu = document.querySelectorAll('.sidebar .nav-link');
    semuaMenu.forEach(m => m.classList.remove('active'));

    const tajukUtama = document.getElementById('tajukModulUtama');
    const penapisSkim = document.getElementById('penapisSkim');

    // 2. Aktifkan menu terpilih & kemaskini paparan
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
    } else if (viewTerpilih === 'DASHBOARD') {
        document.getElementById('menuDashboard')?.classList.add('active');
        alert("Modul Dashboard Pengarah akan diaktifkan dalam Phase 7.");
    }
}
