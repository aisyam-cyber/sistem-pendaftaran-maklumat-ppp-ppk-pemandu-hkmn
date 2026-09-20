/**
 * HOSPITAL KEMAMAN WORKFORCE & SUPERVISION INTELLIGENCE SYSTEM
 * MODUL: auth.js (Logik Log Masuk, Log Keluar & Pengurusan Sesi LocalStorage)
 */

document.addEventListener('DOMContentLoaded', () => {
    semakSesiPengguna();
});

function semakSesiPengguna() {
    const sesi = localStorage.getItem('HK_USER_SESSION');
    if (!sesi) {
        paparModalLogin();
    } else {
        const pengguna = JSON.parse(sesi);
        kemaskiniHeaderPengguna(pengguna);
    }
}

function paparModalLogin() {
    const modalEl = document.getElementById('modalLogin');
    if (modalEl) {
        const modal = new bootstrap.Modal(modalEl, { backdrop: 'static', keyboard: false });
        modal.show();
    }
}

async function hantarLogMasuk() {
    const usernameInput = document.getElementById('loginUsername').value.trim();
    const passwordInput = document.getElementById('loginPassword').value.trim();
    const ralatEl = document.getElementById('loginRalat');

    if (!usernameInput || !passwordInput) {
        ralatEl.innerText = "Sila isi nama pengguna dan kata laluan.";
        ralatEl.classList.remove('d-none');
        return;
    }

    ralatEl.classList.add('d-none');

    const respon = await panggilAPI({
        kaedah: 'POST',
        data: {
            tindakan: 'logMasuk',
            username: usernameInput,
            password: passwordInput
        }
    });

    if (respon.status === 'BERJAYA') {
        const maklumatPengguna = respon.data;
        localStorage.setItem('HK_USER_SESSION', JSON.stringify(maklumatPengguna));
        
        kemaskiniHeaderPengguna(maklumatPengguna);

        const modalEl = document.getElementById('modalLogin');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();

        // Clearkan form login
        document.getElementById('formLogin').reset();
        
        // Muat semula data halaman utama
        muatNaiikAnggota();
    } else {
        ralatEl.innerText = respon.mesej || "Nama pengguna atau kata laluan salah.";
        ralatEl.classList.remove('d-none');
    }
}

function kemaskiniHeaderPengguna(pengguna) {
    const badgeEl = document.getElementById('headerBadgeRole');
    const namaEl = document.getElementById('headerNamaPengguna');

    if (badgeEl) badgeEl.innerHTML = `<i class="fa-solid fa-user-shield me-1"></i> ${pengguna.peranan || 'VIEWER'}`;
    if (namaEl) namaEl.innerText = pengguna.namaPenuh || pengguna.username || 'Pengguna';
}

function hantarLogKeluar() {
    if (confirm("Adakah anda pasti untuk log keluar daripada sistem?")) {
        const sesi = localStorage.getItem('HK_USER_SESSION');
        const pengguna = sesi ? JSON.parse(sesi) : {};

        // Merekodkan audit log untuk log keluar
        panggilAPI({
            kaedah: 'POST',
            data: {
                tindakan: 'logOut',
                pengguna: pengguna.username || 'GUEST'
            }
        });

        localStorage.removeItem('HK_USER_SESSION');
        location.reload();
    }
}
