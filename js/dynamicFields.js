/**
 * HOSPITAL KEMAMAN WORKFORCE SYSTEM
 * MODUL: dynamicFields.js (Enjin Borang Dinamik & Pengurusan Medan Admin)
 */

let senaraiKonfigurasiMedan = [];

async function muatKonfigurasiMedan(skimTerpilih = 'SEMUA') {
  const respon = await panggilAPI({ params: { tindakan: 'dapatkanKonfigurasiMedan' } });
  if (respon.status === 'BERJAYA') {
    senaraiKonfigurasiMedan = respon.data;
    binaMedanDinamikDalaBorang(skimTerpilih);
  }
}

function binaMedanDinamikDalaBorang(skimTerpilih) {
  const bekas = document.getElementById('bekasMedanDinamik');
  if (!bekas) return;

  const medanDitapis = senaraiKonfigurasiMedan.filter(m => 
    m.DIPAPARKAN === 'YA' && 
    m.AKTIF === 'YA' && 
    (m.UNTUK_SKIM === 'SEMUA' || m.UNTUK_SKIM === skimTerpilih)
  );

  if (medanDitapis.length === 0) {
    bekas.innerHTML = '';
    return;
  }

  let html = `<div class="col-12"><hr class="my-3"><h6 class="fw-bold text-navy mb-3"><i class="fa-solid fa-sliders text-warning me-2"></i>Maklumat Tambahan (Dinamik)</h6></div>`;

  medanDitapis.sort((a, b) => Number(a.SUSUNAN) - Number(b.SUSUNAN)).forEach(m => {
    const adakahWajib = m.WAJIB === 'YA' ? 'required' : '';
    const tandaWajib = m.WAJIB === 'YA' ? '<span class="text-danger">*</span>' : '';

    html += `<div class="col-md-6">
      <label class="form-label fw-semibold">${m.LABEL} ${tandaWajib}</label>`;

    if (m.JENIS_DATA === 'DROPDOWN') {
      const pilihan = m.PILIHAN ? m.PILIHAN.split(',') : [];
      html += `<select class="form-select medan-dinamik" data-field-name="${m.NAMA_MEDAN}" ${adakahWajib}>
        <option value="">-- Pilih ${m.LABEL} --</option>
        ${pilihan.map(p => `<option value="${p.trim()}">${p.trim()}</option>`).join('')}
      </select>`;
    } else if (m.JENIS_DATA === 'TEXTAREA') {
      html += `<textarea class="form-control medan-dinamik" data-field-name="${m.NAMA_MEDAN}" rows="2" ${adakahWajib}></textarea>`;
    } else {
      const inputType = m.JENIS_DATA === 'NUMBER' ? 'number' : (m.JENIS_DATA === 'DATE' ? 'date' : 'text');
      html += `<input type="${inputType}" class="form-control medan-dinamik" data-field-name="${m.NAMA_MEDAN}" ${adakahWajib}>`;
    }

    html += `</div>`;
  });

  bekas.innerHTML = html;
}

function kumpulDataMedanDinamik() {
  const elemen = document.querySelectorAll('.medan-dinamik');
  let hasil = {};
  elemen.forEach(el => {
    const namaMedan = el.getAttribute('data-field-name');
    hasil[namaMedan] = el.value;
  });
  return hasil;
}
