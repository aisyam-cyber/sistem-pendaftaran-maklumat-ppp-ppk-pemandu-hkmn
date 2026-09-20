/**
 * HOSPITAL KEMAMAN WORKFORCE SYSTEM
 * MODUL: dynamicFields.js (Enjin Borang Dinamik)
 */

function binaMedanDinamik(senaraiMedan, skimTerpilih = 'ALL') {
    const bekas = document.getElementById('bekasMedanDinamik');
    if (!bekas) return;
    bekas.innerHTML = ''; // Kosongkan

    const medanDitapis = senaraiMedan.filter(m => 
        m.DIPAPARKAN === 'YA' && 
        m.AKTIF === 'YA' && 
        (m.UNTUK_SKIM === 'SEMUA' || m.UNTUK_SKIM === 'ALL' || m.UNTUK_SKIM === skimTerpilih)
    );

    if (medanDitapis.length === 0) return;

    let html = '<div class="border-top pt-3 mt-2"><h6 class="fw-bold text-navy mb-3"><i class="fa-solid fa-sliders me-2"></i>Maklumat Tambahan (Dinamik)</h6><div class="row g-3">';

    medanDitapis.sort((a, b) => a.SUSUNAN - b.SUSUNAN).forEach(m => {
        const adakahWajib = m.WAJIB === 'YA' ? 'required' : '';
        const tandaTanda = m.WAJIB === 'YA' ? '<span class="text-danger">*</span>' : '';

        html += `<div class="col-md-6">
            <label class="form-label fw-semibold">${m.LABEL} ${tandaTanda}</label>`;

        if (m.JENIS_DATA === 'DROPDOWN') {
            const pilihan = m.PILIHAN ? m.PILIHAN.split(',') : [];
            html += `<select class="form-select medan-dinamik" data-field-name="${m.NAMA_MEDAN}" ${adakahWajib}>
                <option value="">-- Pilih ${m.LABEL} --</option>
                ${pilihan.map(p => `<option value="${p.trim()}">${p.trim()}</option>`).join('')}
            </select>`;
        } else if (m.JENIS_DATA === 'TEXTAREA') {
            html += `<textarea class="form-control medan-dinamik" data-field-name="${m.NAMA_MEDAN}" rows="2" ${adakahWajib}></textarea>`;
        } else {
            html += `<input type="${m.JENIS_DATA.toLowerCase()}" class="form-control medan-dinamik" data-field-name="${m.NAMA_MEDAN}" ${adakahWajib}>`;
        }

        html += `</div>`;
    });

    html += '</div></div>';
    bekas.innerHTML = html;
}