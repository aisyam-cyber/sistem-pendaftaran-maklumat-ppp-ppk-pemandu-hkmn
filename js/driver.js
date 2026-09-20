/**
 * HOSPITAL KEMAMAN WORKFORCE & SUPERVISION INTELLIGENCE SYSTEM
 * MODUL: driver.js (Pengurusan Profil Pemandu & Amaran Lesen Expiry)
 */

async function muatModulPemandu() {
    await semakAmaranLesen();

    const respon = await panggilAPI({ params: { tindakan: 'dapatkanAnggotaMengikutSkim', skim: 'PEMANDU' } });
    if (respon.status === 'BERJAYA') {
        paparkanJadualPemandu(respon.data);
    } else {
        console.error("Gagal memuatkan data Pemandu:", respon.mesej);
    }
}

async function semakAmaranLesen() {
    const respon = await panggilAPI({ params: { tindakan: 'semakLesenPemandu' } });
    const bekasAmaran = document.getElementById('bekasAmaranLesen');
    
    if (!bekasAmaran) return;

    if (respon.status === 'BERJAYA' && respon.data && respon.data.length > 0) {
        let html = `<div class="alert alert-warning border-warning shadow-sm mb-4" role="alert">
            <h6 class="fw-bold"><i class="fa-solid fa-triangle-exclamation text-danger me-2"></i> PERHATIAN: LESEN PEMANDU HAMPIR / TELAH TAMAT TEMPOH (${respon.data.length} Anggota)</h6>
            <ul class="mb-0 ps-3 small">`;

        respon.data.forEach(item => {
            const statusBadge = item.STATUS === 'EXPIRED' ? '<span class="badge bg-danger ms-2">TAMAT TEMPOH</span>' : `<span class="badge bg-warning text-dark ms-2">LUPUS DALAM ${item.BAMBA_HARI} HARI</span>`;
            html += `<li><strong>ID: ${item.ID_ANGGOTA}</strong> - Tarikh Tamat: ${item.TARIKH_TAMAT} ${statusBadge}</li>`;
        });

        html += `</ul></div>`;
        bekasAmaran.innerHTML = html;
        bekasAmaran.classList.remove('d-none');
    } else {
        bekasAmaran.classList.add('d-none');
    }
}

function paparkanJadualPemandu(senarai) {
    const tbody = document.getElementById('tbodyAnggota');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (!senarai || senarai.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">Tiada rekod Pemandu ditemui.</td></tr>`;
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
                <td><span class="badge bg-light text-dark border">${a.SKIM || 'PEMANDU'}</span> <small class="fw-semibold">${a.GRED || ''}</small></td>
                <td><small>${a.JABATAN || '-'}</small><br><span class="badge bg-info text-dark">${a.UNIT || '-'}</span></td>
                <td><span class="badge ${badgeStatus}">${a.STATUS_REKOD}</span></td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="bukaProfilPemandu('${a.ID_ANGGOTA}')" title="Urus Profil Pemandu"><i class="fa-solid fa-truck-medical"></i> Profil Pemandu</button>
                    <button class="btn btn-sm btn-outline-warning me-1" onclick="bukaModalArchive('${a.ID_ANGGOTA}')" title="Archive"><i class="fa-solid fa-box-archive"></i></button>
                </td>
            </tr>
        `;
    });
}

async function bukaProfilPemandu(idAnggota) {
    const respon = await panggilAPI({ params: { tindakan: 'dapatkanProfilPemandu', idAnggota: idAnggota } });
    const drv = respon.data || {};

    document.getElementById('drvIDAnggota').value = idAnggota;
    document.getElementById('drvKelasLesen').value = drv.KELAS_LESEN || '';
    document.getElementById('drvTarikhTamat').value = drv.TARIKH_TAMAT_LESEN || '';
    document.getElementById('drvStatusGDL').value = drv.STATUS_GDL || 'TIADA';
    document.getElementById('drvAmbulans').value = drv.KEBENARAN_AMBULANS || 'TIDAK';
    document.getElementById('drvBas').value = drv.KEBENARAN_BAS || 'TIDAK';

    const modalEl = document.getElementById('modalProfilDriver');
    if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    }
}

async function simpanProfilPemandu() {
    const data = {
        ID_ANGGOTA: document.getElementById('drvIDAnggota').value,
        KELAS_LESEN: document.getElementById('drvKelasLesen').value,
        TARIKH_TAMAT_LESEN: document.getElementById('drvTarikhTamat').value,
        STATUS_GDL: document.getElementById('drvStatusGDL').value,
        KEBENARAN_AMBULANS: document.getElementById('drvAmbulans').value,
        KEBENARAN_BAS: document.getElementById('drvBas').value
    };

    if (!data.ID_ANGGOTA) {
        alert("ID Anggota tidak sah.");
        return;
    }

    const respon = await panggilAPI({
        kaedah: 'POST',
        data: { tindakan: 'simpanPemandu', data: data, pengguna: 'SUPERVISOR_DRIVER' }
    });

    alert(respon.mesej);
    if (respon.status === 'BERJAYA') {
        const modalEl = document.getElementById('modalProfilDriver');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();
        muatModulPemandu();
    }
}
