/**
 * HOSPITAL KEMAMAN WORKFORCE SYSTEM
 * MODUL: staff.js (Logik Paparan Induk Anggota)
 */

let semuaAnggotaData = [];
let modalBorang, modalArchive, modalDelete;

document.addEventListener('DOMContentLoaded', () => {
    modalBorang = new bootstrap.Modal(document.getElementById('modalBorangAnggota'));
    modalArchive = new bootstrap.Modal(document.getElementById('modalArchive'));
    modalDelete = new bootstrap.Modal(document.getElementById('modalPermanentDelete'));

    muatNaiikAnggota();
});

async function muatNaiikAnggota() {
    const tbody = document.getElementById('tbodyAnggota');
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted"><i class="fa-solid fa-spinner fa-spin me-2"></i> Memuatkan data terkini...</td></tr>`;

    const respon = await panggilAPI({ params: { tindakan: 'dapatkanSenaraiAnggota' } });

    if (respon.status === 'BERJAYA') {
        semuaAnggotaData = respon.data;
        tapisAnggota();
    } else {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger py-4">${respon.mesej}</td></tr>`;
    }
}

function paparkanJadual(senarai) {
    const tbody = document.getElementById('tbodyAnggota');
    tbody.innerHTML = '';

    if (senarai.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">Tiada rekod anggota dijumpai.</td></tr>`;
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
                <td><span class="badge bg-light text-dark border">${a.SKIM || '-'}</span> <small class="fw-semibold">${a.GRED || ''}</small></td>
                <td><small>${a.JABATAN || '-'}</small><br><span class="badge bg-info text-dark">${a.UNIT || '-'}</span></td>
                <td><span class="badge ${badgeStatus}">${a.STATUS_REKOD}</span></td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="bukaModalEdit('${a.ID_ANGGOTA}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-sm btn-outline-warning me-1" onclick="bukaModalArchive('${a.ID_ANGGOTA}')" title="Tukar Status / Archive"><i class="fa-solid fa-box-archive"></i></button>
                    <button class="btn btn-sm btn-outline-danger" onclick="bukaModalDelete('${a.ID_ANGGOTA}', '${a.NAMA_PENUH}')" title="Padam Kekal (Admin)"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function tapisAnggota() {
    const carian = document.getElementById('inputCarianGlobal').value.toLowerCase();
    const skim = document.getElementById('penapisSkim').value;
    const status = document.getElementById('penapisStatus').value;

    const hasilTapis = semuaAnggotaData.filter(a => {
        const padanCarian = (a.ID_ANGGOTA || '').toLowerCase().includes(carian) ||
                             (a.NAMA_PENUH || '').toLowerCase().includes(carian) ||
                             (a.NO_KP || '').includes(carian) ||
                             (a.UNIT || '').toLowerCase().includes(carian);
        const padanSkim = !skim || a.SKIM === skim;
        const padanStatus = !status || a.STATUS_REKOD === status;

        return padanCarian && padanSkim && padanStatus;
    });

    paparkanJadual(hasilTapis);
}

function bukaModalDaftarAnggota() {
    document.getElementById('formIndukAnggota').reset();
    document.getElementById('formIDAnggota').readOnly = false;
    document.getElementById('tajukModalAnggota').innerHTML = `<i class="fa-solid fa-user-plus me-2"></i> Tambah Anggota Baharu`;
    modalBorang.show();
}

async function hantarBorangAnggota() {
    const data = {
        ID_ANGGOTA: document.getElementById('formIDAnggota').value,
        NO_KP: document.getElementById('formNoKP').value,
        NAMA_PENUH: document.getElementById('formNamaPenuh').value,
        SKIM: document.getElementById('formSkim').value,
        GRED: document.getElementById('formGred').value,
        JABATAN: document.getElementById('formJabatan').value,
        UNIT: document.getElementById('formUnit').value,
        NO_TELEFON_RASMI: document.getElementById('formNoTel').value,
        EMAIL_RASMI: document.getElementById('formEmail').value
    };

    const respon = await panggilAPI({
        kaedah: 'POST',
        data: { tindakan: 'simpanAnggotaInduk', data: data, pengguna: 'PENYELIA_UTAMA' }
    });

    alert(respon.mesej);
    if (respon.status === 'BERJAYA') {
        modalBorang.hide();
        muatNaiikAnggota();
    }
}

function bukaModalArchive(idAnggota) {
    document.getElementById('archiveIDAnggota').value = idAnggota;
    document.getElementById('archiveSebab').value = '';
    modalArchive.show();
}

async function sahkanArchive() {
    const idAnggota = document.getElementById('archiveIDAnggota').value;
    const statusBaharu = document.getElementById('archiveStatusBaharu').value;
    const tarikhKeluar = document.getElementById('archiveTarikhKeluar').value;
    const tempatBertukar = document.getElementById('archiveTempatBertukar').value;
    const sebab = document.getElementById('archiveSebab').value;

    if (!sebab) {
        alert("Sebab pertukaran/pengarkiban WAJIB diisi.");
        return;
    }

    const respon = await panggilAPI({
        kaedah: 'POST',
        data: {
            tindakan: 'tukarStatusArchive',
            idAnggota: idAnggota,
            statusBaharu: statusBaharu,
            tarikhKeluar: tarikhKeluar,
            tempatBertukar: tempatBertukar,
            sebab: sebab,
            pengguna: 'PENYELIA_UTAMA'
        }
    });

    alert(respon.mesej);
    if (respon.status === 'BERJAYA') {
        modalArchive.hide();
        muatNaiikAnggota();
    }
}

function bukaModalDelete(idAnggota, namaPenuh) {
    document.getElementById('deleteIDAnggota').value = idAnggota;
    document.getElementById('deleteIDDisplay').innerText = `ID: ${idAnggota}`;
    document.getElementById('deleteNamaDisplay').innerText = `Nama: ${namaPenuh}`;
    document.getElementById('deleteSebab').value = '';
    modalDelete.show();
}

async function sahkanPemadamanKekal() {
    const idAnggota = document.getElementById('deleteIDAnggota').value;
    const sebab = document.getElementById('deleteSebab').value;

    if (!sebab) {
        alert("Sebab pemadaman kekal wajib dinyatakan.");
        return;
    }

    const respon = await panggilAPI({
        kaedah: 'POST',
        data: {
            tindakan: 'padamAnggotaKekal',
            idAnggota: idAnggota,
            peranan: 'SUPER_ADMIN',
            sebab: sebab,
            pengguna: 'SUPER_ADMIN'
        }
    });

    alert(respon.mesej);
    if (respon.status === 'BERJAYA') {
        modalDelete.hide();
        muatNaiikAnggota();
    }
}