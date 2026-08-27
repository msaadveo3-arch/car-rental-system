export class PDFGenerator {
    constructor(dataManager) { this.dataManager = dataManager; }

    async generateReport() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        const recs = this.dataManager.getAllRecords();

        if (recs.length === 0) return alert('لا توجد بيانات لإصدار التقرير!');

        const pdfContent = document.getElementById('pdf-content');
        document.getElementById('pdf-date').textContent = `تاريخ الفحص: ${new Date().toLocaleString('ar-EG')}`;

        const container = document.getElementById('pdf-damages');
        container.innerHTML = '';

        recs.forEach((d, i) => {
            const div = document.createElement('div');
            div.style.cssText = 'border:1px solid #e2e8f0; padding:15px; margin-bottom:15px; border-radius:8px; page-break-inside: avoid;';
            const imgs = (d.images || []).map(img =>
                `<img src="${img}" style="width:120px; height:90px; object-fit:cover; border:1px solid #ddd; border-radius:6px;">`
            ).join('');
            div.innerHTML = `
                <h4 style="color:#dc2626; margin:0 0 6px;">#${i + 1} — ${d.part || '(بدون اسم)'}</h4>
                <p style="margin:4px 0;"><b>نوع الضرر:</b> ${d.damageType || '—'} &nbsp;|&nbsp; <b>الدرجة:</b> ${d.damageLevel || '—'}</p>
                <p style="margin:4px 0;"><b>ملاحظات:</b> ${d.notes || 'لا توجد'}</p>
                ${imgs ? `<div style="display:flex; gap:10px; margin-top:10px; flex-wrap:wrap;">${imgs}</div>` : ''}
            `;
            container.appendChild(div);
        });

        try {
            const canvas = await html2canvas(pdfContent, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = doc.internal.pageSize.getWidth();
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;
            const pageHeight = doc.internal.pageSize.getHeight();

            let heightLeft = imgHeight;
            let position = 0;
            doc.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pageHeight;
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            doc.save('Car_Damage_Report.pdf');
        } catch (err) {
            console.error(err);
            alert('خطأ في إنشاء PDF');
        }
    }
}