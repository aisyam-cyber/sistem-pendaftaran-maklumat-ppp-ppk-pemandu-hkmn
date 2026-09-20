/**
 * HOSPITAL KEMAMAN WORKFORCE & SUPERVISION INTELLIGENCE SYSTEM
 * MODUL: ppp.js (Pengurusan Profil Penolong Pegawai Perubatan)
 */

async function muatModulPPP() {
    const respon = await panggilAPI({ params: { tindakan: 'dapatkanAnggotaMengikutSkim', skim: 'PPP' } });
    if (respon.status === 'BERJAYA') {
        paparkanJadualPPP(respon.data);
    } else {
        console.error("Gagal memuatkan data PPP:", respon.mesej);
    }
}

function paparkanJadualPPP(senarai) {
    const tbody = document.getElementById('tbodyAnggota');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    if (!senarai || senarai.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">Tiada rekod PPP ditemui.</td></tr>`;
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
                <td><span class="badge bg-light text-dark border">${a.SKIM || 'PPP'}</span> <small class="fw-semibold">${a.GRED || ''}</small></td>
                <td><small>${a.JABATAN || '-'}</small><br><span class="badge bg-info text-dark">${a.UNIT || '-'}</span></td>
                <td><span class="badge ${badgeStatus}">${a.STATUS_REKOD}</span></td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="bukaProfilPPP('${a.ID_ANGGOTA}')" title="Urus Profil PPP"><i class="fa-solid fa-user-nurse"></i> Profil PPP</button>
                    <button class="btn btn-sm btn-outline-warning me-1" onclick="bukaModalArchive('${a.ID_ANGGOTA}')" title="Archive"><i class="fa-solid fa-box-archive"></i></button>
                </td>
            </tr>
        `;
    });
}

async function bukaProfilPPP(idAnggota) {
    const respon = await panggilAPI({ params: { tindakan: 'dapatkanProfilPPP', idAnggota: idAnggota } });
    const ppp = respon.data || {};

    document.getElementById('pppIDAnggota').value = idAnggota;
    document.getElementById('pppNoAPC').value = ppp.NO_APC || '';
    document.getElementById('pppTahunAPC').value = ppp.TAHUN_APC || new Date().getFullYear();
    document.getElementById('pppCredentialing').value = ppp.STATUS_CREDENTIALING || 'DALAM_PROSES';
    document.getElementById('pppPrivileging').value = ppp.STATUS_PRIVILEGING || 'DALAM_PROSES';
    document.getElementById('pppPosBasik').value = ppp.POS_BASIK || '';
    document.getElementById('pppFungsiKlinikal').value = ppp.FUNGSI_KLINIKAL || '';

    const modal = new bootstrap.Modal(document.getElementById('modalProfilPPP'));
    modal.show();
}

async function simpanProfilPPP() {
    const data = {
        ID_ANGGOTA: document.getElementById('pppIDAnggota').value,
        NO_APC: document.getElementById('pppNoAPC').value,
        TAHUN_APC: document.getElementById('pppTahunAPC').value,
        STATUS_CREDENTIALING: document.getElementById('pppCredentialing').value,
        STATUS_PRIVILEGING: document.getElementById('pppPrivileging').value,
        POS_BASIK: document.getElementById('pppPosBasik').value,
        FUNGSI_KLINIKAL: document.getElementById('pppFungsiKlinikal').value
    };

    if (!data.ID_ANGGOTA) {
        alert("ID Anggota tidak sah.");
        return;
    }

    const respon = await panggilAPI({
        kaedah: 'POST',
        data: { tindakan: 'simpanPPP', data: data, pengguna: 'SUPERVISOR_PPP' }
    });

    alert(respon.mesej);
    if (respon.status === 'BERJAYA') {
        const modalEl = document.getElementById('modalProfilPPP');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();
        muatModulPPP();
    }
}
