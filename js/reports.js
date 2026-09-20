/**
 * HOSPITAL KEMAMAN WORKFORCE & SUPERVISION INTELLIGENCE SYSTEM
 * MODUL: reports.js (Logik Penjanaan & Cetakan Laporan)
 */

let dataLaporanTerkini = [];

async function janaDanPaparkanLaporan() {
    const bekas = document.getElementById('bekasJadualLaporan');
    if (bekas) {
        bekas.innerHTML = `<div class="text-center py-5 text-muted border rounded bg-white"><i class="fa-solid fa-spinner fa-spin me-2"></i> Menjana laporan rasmi...</div>`;
    }

    const skim = document.getElementById('laporanSkim')?.value || '';
    const status = document.getElementById('laporanStatus')?.value || 'ACTIVE';
    const unit = document.getElementById('laporanUnit')?.value || '';

    const respon = await panggilAPI({
        kaedah: 'POST',
        data: {
            tindakan: 'janaLaporan',
            parameter: { skim: skim, status: status, unit: unit, pengguna: 'PENYELIA_UTAMA' }
        }
    });

    if (respon.status === 'BERJAYA') {
        dataLaporanTerkini = respon.data.senarai || [];
        paparkanJadualLaporan(respon.data);
    } else {
        alert("Gagal menjana laporan: " + respon.mesej);
    }
}

function paparkanJadualLaporan(dataLaporan) {
    const bekas = document.getElementById('bekasJadualLaporan');
    if (!bekas) return;

    const meta = dataLaporan.meta;
    const senarai = dataLaporan.senarai;

    let html = `
        <div class="p-4 bg-white border rounded shadow-sm" id="kawasanCetak">
            <!-- KEPALA SURAT RASMI KKM -->
            <div class="text-center border-bottom pb-3 mb-4">
                <h4 class="fw-extrabold text-navy m-0">KEMENTERIAN KESIHATAN MALAYSIA</h4>
                <h5 class="fw-bold m-0">${meta.fasiliti}</h5>
                <p class="text-muted small m-0">${meta.unitPenyeliaan}</p>
                <hr class="my-2">
                <h6 class="fw-bold text-uppercase mt-3">${meta.tajukLaporan}</h6>
                <small class="text-muted">Tarikh Dijana: ${meta.tarikhDijana} | Jumlah Rekod: ${meta.jumlahRekod}</small>
            </div>

            <!-- JADUAL DATA -->
            <table class="table table-bordered align-middle">
                <thead class="table-dark">
                    <tr>
                        <th>#</th>
                        <th>ID Anggota</th>
                        <th>Nama Penuh</th>
                        <th>No. KP</th>
                        <th>Skim & Gred</th>
                        <th>Unit Bertugas</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>`;

    if (senarai.length === 0) {
        html += `<tr><td colspan="7" class="text-center py-4">Tiada data ditemui mengikut penapis terpilih.</td></tr>`;
    } else {
        senarai.forEach((a, index) => {
            html += `
                <tr>
                    <td>${index + 1}</td>
                    <td><strong>${a.ID_ANGGOTA}</strong></td>
                    <td>${a.NAMA_PENUH}</td>
                    <td>${a.NO_KP}</td>
                    <td>${a.SKIM} (${a.GRED || '-'})</td>
                    <td>${a.UNIT || '-'}</td>
                    <td><span class="badge bg-secondary">${a.STATUS_REKOD}</span></td>
                </tr>`;
        });
    }

    html += `</tbody></table></div>`;
    bekas.innerHTML = html;
}

function cetakLaporan() {
    window.print();
}

function eksportKeCSV() {
    if (dataLaporanTerkini.length === 0) {
        alert("Tiada data untuk dieksport. Sila jana laporan terlebih dahulu.");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID_ANGGOTA,NAMA_PENUH,NO_KP,SKIM,GRED,JABATAN,UNIT,STATUS_REKOD\n";

    dataLaporanTerkini.forEach(a => {
        let row = `"${a.ID_ANGGOTA}","${a.NAMA_PENUH}","${a.NO_KP}","${a.SKIM}","${a.GRED || ''}","${a.JABATAN || ''}","${a.UNIT || ''}","${a.STATUS_REKOD}"`;
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Hospital_Kemaman_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
