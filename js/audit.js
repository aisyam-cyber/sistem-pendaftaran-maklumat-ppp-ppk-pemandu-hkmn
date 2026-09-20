/**
 * HOSPITAL KEMAMAN WORKFORCE & SUPERVISION INTELLIGENCE SYSTEM
 * MODUL: audit.js (Logik Paparan Log Audit Keselamatan)
 */

async function muatLogAudit() {
    const bekas = document.getElementById('tbodyLogAudit');
    if (bekas) {
        bekas.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted"><i class="fa-solid fa-spinner fa-spin me-2"></i> Memuatkan log audit keselamatan...</td></tr>`;
    }

    const respon = await panggilAPI({ params: { tindakan: 'dapatkanSenaraiLogAudit' } });

    if (respon.status === 'BERJAYA') {
        paparkanJadualAudit(respon.data || []);
    } else {
        if (bekas) {
            bekas.innerHTML = `<tr><td colspan="6" class="text-center text-danger py-4">${respon.mesej}</td></tr>`;
        }
    }
}

function paparkanJadualAudit(senarai) {
    const bekas = document.getElementById('tbodyLogAudit');
    if (!bekas) return;

    bekas.innerHTML = '';

    if (senarai.length === 0) {
        bekas.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">Tiada rekod log audit ditemui.</td></tr>`;
        return;
    }

    senarai.forEach(log => {
        let badgeTindakan = 'bg-primary';
        if (log.TINDAKAN === 'CREATE' || log.TINDAKAN === 'CIPTA') badgeTindakan = 'bg-success';
        if (log.TINDAKAN === 'UPDATE' || log.TINDAKAN === 'KEMASKINI') badgeTindakan = 'bg-info text-dark';
        if (log.TINDAKAN === 'ARCHIVE' || log.TINDAKAN === 'DELETE') badgeTindakan = 'bg-danger';

        const tarikhFormatted = log.CAP_MASA ? new Date(log.CAP_MASA).toLocaleString('ms-MY') : '-';

        bekas.innerHTML += `
            <tr>
                <td><small class="fw-bold text-muted">${log.ID_AUDIT || '-'}</small></td>
                <td><small>${tarikhFormatted}</small></td>
                <td><strong>${log.PENGGUNA || 'SYSTEM'}</strong></td>
                <td><span class="badge ${badgeTindakan}">${log.TINDAKAN || '-'}</span></td>
                <td><small class="fw-semibold">${log.MODUL || '-'}</small></td>
                <td><small>${log.SEBAB || '-'}</small></td>
            </tr>
        `;
    });
}
