/**
 * HOSPITAL KEMAMAN WORKFORCE SYSTEM
 * MODUL: api.js (Komunikasi API Backend)
 */

// Sila gantikan URL berikut dengan Google Apps Script Web App URL anda selepas deployment
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbx_GANTIKAN_DENGAN_DEPLOYMENT_URL_ANDA/exec";

async function panggilAPI(pilihan = {}) {
    try {
        let url = GAS_API_URL;
        let config = {
            method: pilihan.kaedah || 'GET',
        };

        if (pilihan.kaedah === 'POST') {
            config.body = JSON.stringify(pilihan.data);
            config.headers = { 'Content-Type': 'text/plain;charset=utf-8' };
        } else if (pilihan.params) {
            const queryParams = new URLSearchParams(pilihan.params).toString();
            url += '?' + queryParams;
        }

        const respon = await fetch(url, config);
        const hasil = await respon.json();
        return hasil;
    } catch (err) {
        console.error("Ralat Rangkaian/API:", err);
        return { status: 'RALAT', mesej: 'Gagal berhubung dengan pelayan Apps Script.' };
    }
}
