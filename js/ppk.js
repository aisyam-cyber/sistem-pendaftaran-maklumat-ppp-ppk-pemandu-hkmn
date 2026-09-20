/**
 * HOSPITAL KEMAMAN WORKFORCE & SUPERVISION INTELLIGENCE SYSTEM
 * MODUL: ppk.js (Pengurusan Profil Pembantu Perawatan Kesihatan)
 */

async function muatModulPPK() {
    const respon = await panggilAPI({ params: { tindakan: 'dapatkanAnggotaMengikutSkim', skim: 'PPK' } });
    if (respon.status === 'BERJAYA') {
        paparkanJadualPPK(respon.data);
    } else {
        console.error("Gagal memuatkan data PPK:", respon.mesej);
    }
}

function paparkanJadualPPK(senarai) {
    const tbody = document.getElementById('tbodyAnggota');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    if (!senarai || senarai.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">Tiada rekod PPK ditemui.</td></tr>`;
        return;
    }

    senarai.forEach(a => {
        let badgeStatus = 'bg-success';
        if (a.STATUS_REKOD === 'TRANSFERRED') badgeStatus = 'bg-warning text-dark';
        if (a.STATUS_REKOD === 'RETIRED' || a.STATUS_REKOD === 'ARCHIVED') badgeStatus = 'bg-secondary';

        tbody.innerHTML += `
            <tr>
                <td><strong class="text-navy">${a.ID_ANGGOTA}</strong></td>
                <td>
                    <div class="fw-bold">${a.NAMA_PENUH}</div>
                    <small class="text-muted">KP: ${a.NO_KP}</small>
                </td>
                <td><span class="badge bg-light text-dark border">${a.SKIM || 'PPK'}</span> <small class="fw-semibold">${a.GRED || ''}</small></td>
                <td><small>${a.JABATAN || '-'}</small><br><span class="badge bg-info text-dark">${a.UNIT || '-'}</span></td>
                <td><span class="badge ${badgeStatus}">${a.STATUS_REKOD}</span></td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="bukaProfilPPK('${a.ID_ANGGOTA}')" title="Urus Profil PPK"><i class="fa-solid fa-hands-holding-child"></i> Profil PPK</button>
                    <button class="btn btn-sm btn-outline-warning me-1" onclick="bukaModalArchive('${a.ID_ANGGOTA}')" title="Archive"><i class="fa-solid fa-box-archive"></i></button>
                </td>
            </tr>
        `;
    });
}

async function bukaProfilPPK(idAnggota) {
    const respon = await panggilAPI({ params: { tindakan: 'dapatkanProfilPPK', idAnggota: idAnggota } });
    const ppk = respon.data || {};

    document.getElementById('ppkIDAnggota').value = idAnggota;
    document.getElementById('ppkTugasUtama').value = ppk.BIDANG_TUGAS_UTAMA || '';
    document.getElementById('ppkKemahiran').value = ppk.KEMAHIRAN_KHAS || '';
    document.getElementById('ppkStatusPenilaian').value = ppk.STATUS_PENILAIAN || 'BELUM_DINILAI';

    const modalEl = document.getElementById('modalProfilPPK');
    if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    }
}

async function simpanProfilPPK() {
    const data = {
        ID_ANGGOTA: document.getElementById('ppkIDAnggota').value,
        BIDANG_TUGAS_UTAMA: document.getElementById('ppkTugasUtama').value,
        KEMAHIRAN_KHAS: document.getElementById('ppkKemahiran').value,
        STATUS_PENILAIAN: document.getElementById('ppkStatusPenilaian').value
    };

    if (!data.ID_ANGGOTA) {
        alert("ID Anggota tidak sah.");
        return;
    }

    const respon = await panggilAPI({
        kaedah: 'POST',
        data: { tindakan: 'simpanPPK', data: data, pengguna: 'SUPERVISOR_PPK' }
    });

    alert(respon.mesej);
    if (respon.status === 'BERJAYA') {
        const modalEl = document.getElementById('modalProfilPPK');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();
        muatModulPPK();
    }
}
