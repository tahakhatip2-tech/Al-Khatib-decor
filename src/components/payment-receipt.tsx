import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ProjectPayment, ProjectSummary } from "@/types/project";
import { Printer, Download, MessageCircle, X, CheckCircle, Stamp } from "lucide-react";

interface ReceiptProps {
  payment: ProjectPayment;
  summary: ProjectSummary;
  onClose: () => void;
}

const PAY_METHODS: Record<string, string> = {
  cash: "نقداً",
  bank: "تحويل بنكي",
  check: "شيك",
  transfer: "حوالة مالية",
};

function numberToArabicWords(num: number): string {
  const ones = ["", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة",
    "عشرة", "أحد عشر", "اثنا عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر", "ستة عشر",
    "سبعة عشر", "ثمانية عشر", "تسعة عشر"];
  const tens = ["", "", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"];
  const hundreds = ["", "مائة", "مئتان", "ثلاثمائة", "أربعمائة", "خمسمائة", "ستمائة", "سبعمائة", "ثمانمائة", "تسعمائة"];

  if (num === 0) return "صفر";
  if (num >= 1000) {
    const t = Math.floor(num / 1000);
    const r = num % 1000;
    const tStr = t === 1 ? "ألف" : t === 2 ? "ألفان" : t <= 10 ? ones[t] + " آلاف" : ones[t] + " ألف";
    return r > 0 ? tStr + " و" + numberToArabicWords(r) : tStr;
  }
  if (num >= 100) {
    const h = Math.floor(num / 100);
    const r = num % 100;
    return r > 0 ? hundreds[h] + " و" + numberToArabicWords(r) : hundreds[h];
  }
  if (num >= 20) {
    const t = Math.floor(num / 10);
    const r = num % 10;
    return r > 0 ? ones[r] + " و" + tens[t] : tens[t];
  }
  return ones[num] || num.toString();
}

export function PaymentReceiptModal({ payment, summary, onClose }: ReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const receiptNumber = `RCP-${payment.id.slice(-6).toUpperCase()}`;
  const totalPaid = summary.totalPayments;
  const remaining = summary.remaining;
  const amountInWords = numberToArabicWords(Math.floor(payment.amount)) + " دينار أردني لا غير";

  const handlePrint = () => {
    const printContent = receiptRef.current;
    if (!printContent) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="utf-8"/>
        <title>سند قبض - ${receiptNumber}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Cairo', 'Arial', sans-serif; background: #fff; direction: rtl; }
          .receipt { width: 210mm; min-height: 148mm; padding: 16mm; position: relative; }
          .header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 12px; border-bottom: 3px double #c8a84b; margin-bottom: 16px; }
          .logo-wrap { width: 72px; height: 72px; border-radius: 50%; border: 3px solid #c8a84b; overflow: hidden; display: flex; align-items: center; justify-content: center; background: white; }
          .logo-wrap img { width: 100%; height: 100%; object-fit: contain; }
          .company-info { flex: 1; text-align: center; }
          .company-name { font-size: 20px; font-weight: 900; color: #1a1a2e; letter-spacing: 0.5px; }
          .company-sub { font-size: 12px; color: #666; margin-top: 2px; }
          .receipt-badge { text-align: left; }
          .receipt-title { background: linear-gradient(135deg, #c8a84b, #f0c040); color: white; font-size: 18px; font-weight: 900; padding: 8px 18px; border-radius: 8px; display: inline-block; }
          .receipt-num { font-size: 11px; color: #888; margin-top: 4px; }
          .section-title { font-size: 11px; font-weight: 700; color: #c8a84b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; border-right: 3px solid #c8a84b; padding-right: 8px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
          .info-card { background: #fafafa; border: 1px solid #eee; border-radius: 8px; padding: 10px 14px; }
          .info-label { font-size: 10px; color: #999; margin-bottom: 3px; }
          .info-value { font-size: 13px; font-weight: 700; color: #1a1a2e; }
          .amount-box { background: linear-gradient(135deg, #1a1a2e, #2d2d5a); color: white; border-radius: 12px; padding: 16px 24px; margin: 16px 0; text-align: center; }
          .amount-label { font-size: 11px; color: rgba(255,255,255,0.7); margin-bottom: 4px; }
          .amount-value { font-size: 34px; font-weight: 900; color: #f0c040; letter-spacing: 1px; }
          .amount-words { font-size: 12px; color: rgba(255,255,255,0.85); margin-top: 6px; }
          .summary-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; background: #f8f8f8; border-radius: 8px; margin-bottom: 8px; }
          .summary-label { font-size: 12px; color: #555; }
          .summary-value { font-size: 14px; font-weight: 800; }
          .green { color: #16a34a; }
          .red { color: #dc2626; }
          .amber { color: #d97706; }
          .stamp-area { position: absolute; bottom: 24mm; left: 20mm; text-align: center; }
          .stamp { width: 90px; height: 90px; border-radius: 50%; border: 4px solid #c8a84b; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; }
          .stamp::before { content: ''; position: absolute; inset: 4px; border-radius: 50%; border: 2px dashed #c8a84b; }
          .stamp-text { font-size: 9px; font-weight: 800; color: #c8a84b; text-align: center; z-index: 1; }
          .sig-area { position: absolute; bottom: 24mm; right: 20mm; text-align: center; }
          .sig-line { width: 100px; height: 1px; background: #333; margin: 28px auto 4px; }
          .sig-label { font-size: 10px; color: #666; }
          .footer { margin-top: 16px; padding-top: 10px; border-top: 1px solid #eee; text-align: center; font-size: 10px; color: #aaa; }
          .method-badge { display: inline-block; background: #1a1a2e; color: #f0c040; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
          @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="receipt">
          ${printContent.innerHTML}
        </div>
      </body>
      </html>
    `);
    win.document.close();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  const handleDownloadPDF = async () => {
    const { default: html2canvas } = await import("html2canvas");
    const { default: jsPDF } = await import("jspdf");
    const element = receiptRef.current;
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a5" });
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, w, h);
    pdf.save(`سند-قبض-${receiptNumber}.pdf`);
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
`🧾 *سند قبض - مؤسسة الخطيب للديكور والعزل*
━━━━━━━━━━━━━━━━
📋 *رقم السند:* ${receiptNumber}
📅 *التاريخ:* ${payment.date}
👤 *العميل:* ${summary.project.client}
🏗️ *المشروع:* ${summary.project.name}
━━━━━━━━━━━━━━━━
💰 *المبلغ المستلم:* ${payment.amount.toLocaleString()} دينار
💳 *طريقة الدفع:* ${PAY_METHODS[payment.method] || payment.method}
${payment.reference ? `🔖 *المرجع:* ${payment.reference}` : ""}
━━━━━━━━━━━━━━━━
✅ *إجمالي المدفوع:* ${totalPaid.toLocaleString()} دينار
⏳ *المتبقي للتحصيل:* ${remaining.toLocaleString()} دينار
━━━━━━━━━━━━━━━━
📞 للاستفسار: 0782633162
شكراً لثقتكم بمؤسسة الخطيب 🏠`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const BASE_URL = import.meta.env.BASE_URL || "/";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl">
        {/* Action Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
          <h2 className="font-bold text-slate-800 text-lg">سند قبض احترافي</h2>
          <div className="flex items-center gap-2">
            <Button onClick={handleWhatsApp} size="sm" className="bg-green-500 hover:bg-green-600 text-white gap-2">
              <MessageCircle className="w-4 h-4" />
              واتساب
            </Button>
            <Button onClick={handlePrint} size="sm" variant="outline" className="gap-2">
              <Printer className="w-4 h-4" />
              طباعة
            </Button>
            <Button onClick={handleDownloadPDF} size="sm" className="bg-primary text-white gap-2">
              <Download className="w-4 h-4" />
              PDF
            </Button>
            <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Receipt Preview */}
        <div className="p-6 bg-slate-100 overflow-auto">
          <div
            ref={receiptRef}
            style={{
              fontFamily: "'Cairo', 'Arial', sans-serif",
              direction: "rtl",
              background: "white",
              padding: "32px 40px",
              borderRadius: "16px",
              position: "relative",
              minHeight: "420px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid #e5e7eb",
            }}
          >
            {/* Watermark */}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 0 }}>
              <div style={{ fontSize: "100px", fontWeight: 900, color: "rgba(200,168,75,0.04)", transform: "rotate(-30deg)", whiteSpace: "nowrap", userSelect: "none" }}>
                مؤسسة الخطيب
              </div>
            </div>

            <div style={{ position: "relative", zIndex: 1 }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "16px", borderBottom: "3px double #c8a84b", marginBottom: "20px" }}>
                {/* Logo */}
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", border: "3px solid #c8a84b", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "white", flexShrink: 0 }}>
                  <img src={`${BASE_URL}taha.png`} alt="شعار" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </div>

                {/* Company Info */}
                <div style={{ flex: 1, textAlign: "center", padding: "0 16px" }}>
                  <div style={{ fontSize: "20px", fontWeight: 900, color: "#1a1a2e", letterSpacing: "0.5px" }}>مؤسسة الخطيب للديكور والعزل</div>
                  <div style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>Al-Khateeb Decor & Insulation Est.</div>
                  <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>📞 0782633162 &nbsp;|&nbsp; عمان، الأردن</div>
                </div>

                {/* Receipt Label */}
                <div style={{ textAlign: "left", flexShrink: 0 }}>
                  <div style={{ background: "linear-gradient(135deg, #c8a84b, #f0c040)", color: "white", fontSize: "18px", fontWeight: 900, padding: "8px 16px", borderRadius: "8px", textAlign: "center" }}>
                    سند قبض
                  </div>
                  <div style={{ fontSize: "11px", color: "#999", marginTop: "6px", textAlign: "center" }}>{receiptNumber}</div>
                  <div style={{ fontSize: "11px", color: "#666", textAlign: "center", marginTop: "2px" }}>📅 {payment.date}</div>
                </div>
              </div>

              {/* Info Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                <div style={{ background: "#fafafa", border: "1px solid #f0e8d0", borderRadius: "10px", padding: "12px 16px" }}>
                  <div style={{ fontSize: "10px", color: "#999", marginBottom: "4px" }}>اسم العميل</div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#1a1a2e" }}>{summary.project.client}</div>
                  {summary.project.clientPhone && <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>📞 {summary.project.clientPhone}</div>}
                </div>
                <div style={{ background: "#fafafa", border: "1px solid #f0e8d0", borderRadius: "10px", padding: "12px 16px" }}>
                  <div style={{ fontSize: "10px", color: "#999", marginBottom: "4px" }}>المشروع</div>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: "#1a1a2e" }}>{summary.project.name}</div>
                  <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>📍 {summary.project.location}</div>
                </div>
                <div style={{ background: "#fafafa", border: "1px solid #f0e8d0", borderRadius: "10px", padding: "12px 16px" }}>
                  <div style={{ fontSize: "10px", color: "#999", marginBottom: "4px" }}>طريقة الدفع</div>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: "#1a1a2e" }}>{PAY_METHODS[payment.method]}</div>
                  {payment.reference && <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>رقم: {payment.reference}</div>}
                </div>
                <div style={{ background: "#fafafa", border: "1px solid #f0e8d0", borderRadius: "10px", padding: "12px 16px" }}>
                  <div style={{ fontSize: "10px", color: "#999", marginBottom: "4px" }}>ملاحظات</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#444" }}>{payment.notes || "—"}</div>
                </div>
              </div>

              {/* Amount Box */}
              <div style={{ background: "linear-gradient(135deg, #1a1a2e, #2a2a5a)", color: "white", borderRadius: "14px", padding: "20px 32px", textAlign: "center", marginBottom: "16px" }}>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", marginBottom: "6px", letterSpacing: "2px", textTransform: "uppercase" }}>المبلغ المستلم</div>
                <div style={{ fontSize: "42px", fontWeight: 900, color: "#f0c040", letterSpacing: "2px" }}>{payment.amount.toLocaleString()} <span style={{ fontSize: "20px" }}>د.أ</span></div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", marginTop: "8px", fontStyle: "italic" }}>فقط {amountInWords}</div>
              </div>

              {/* Financial Summary */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "20px" }}>
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "10px", textAlign: "center" }}>
                  <div style={{ fontSize: "10px", color: "#16a34a", marginBottom: "4px" }}>إجمالي الميزانية</div>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "#15803d" }}>{summary.project.budget.toLocaleString()} <span style={{ fontSize: "11px" }}>د.أ</span></div>
                </div>
                <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "10px", padding: "10px", textAlign: "center" }}>
                  <div style={{ fontSize: "10px", color: "#2563eb", marginBottom: "4px" }}>إجمالي المدفوع</div>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "#1d4ed8" }}>{totalPaid.toLocaleString()} <span style={{ fontSize: "11px" }}>د.أ</span></div>
                </div>
                <div style={{ background: remaining > 0 ? "#fff7ed" : "#f0fdf4", border: `1px solid ${remaining > 0 ? "#fed7aa" : "#bbf7d0"}`, borderRadius: "10px", padding: "10px", textAlign: "center" }}>
                  <div style={{ fontSize: "10px", color: remaining > 0 ? "#ea580c" : "#16a34a", marginBottom: "4px" }}>المتبقي للتحصيل</div>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: remaining > 0 ? "#c2410c" : "#15803d" }}>{remaining.toLocaleString()} <span style={{ fontSize: "11px" }}>د.أ</span></div>
                </div>
              </div>

              {/* Stamp + Signature */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "8px", paddingTop: "16px", borderTop: "1px dashed #e5e7eb" }}>
                {/* Stamp */}
                <div style={{ textAlign: "center" }}>
                  <div style={{ position: "relative", width: "96px", height: "96px", margin: "0 auto 8px" }}>
                    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "4px solid #c8a84b", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(200,168,75,0.04)" }}>
                      <div style={{ position: "absolute", inset: "6px", borderRadius: "50%", border: "2px dashed #c8a84b" }} />
                      <div style={{ zIndex: 1, textAlign: "center", padding: "8px" }}>
                        <div style={{ fontSize: "8px", fontWeight: 800, color: "#c8a84b", lineHeight: 1.4 }}>مؤسسة الخطيب</div>
                        <div style={{ fontSize: "7px", color: "#c8a84b", lineHeight: 1.3 }}>للديكور والعزل</div>
                        <div style={{ fontSize: "7px", color: "#c8a84b", lineHeight: 1.3 }}>عمان - الأردن</div>
                        <div style={{ fontSize: "8px", fontWeight: 800, color: "#c8a84b", marginTop: "2px", lineHeight: 1.3 }}>✓ مدفوعة</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: "10px", color: "#888" }}>ختم المؤسسة</div>
                </div>

                {/* Confirmation text */}
                <div style={{ flex: 1, textAlign: "center", padding: "0 16px" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "8px", padding: "8px 16px" }}>
                    <span style={{ fontSize: "20px" }}>✅</span>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "#15803d" }}>تم الاستلام بنجاح</div>
                      <div style={{ fontSize: "10px", color: "#4ade80" }}>{payment.date}</div>
                    </div>
                  </div>
                </div>

                {/* Signature */}
                <div style={{ textAlign: "center", minWidth: "120px" }}>
                  <div style={{ height: "40px" }} />
                  <div style={{ width: "100px", height: "1px", background: "#333", margin: "0 auto 6px" }} />
                  <div style={{ fontSize: "10px", color: "#666" }}>توقيع المفوض</div>
                  <div style={{ fontSize: "10px", color: "#888", marginTop: "2px" }}>طه الخطيب</div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ marginTop: "16px", paddingTop: "10px", borderTop: "1px solid #f3f4f6", textAlign: "center", fontSize: "10px", color: "#aaa" }}>
                وثيقة رسمية صادرة عن مؤسسة الخطيب للديكور والعزل | هاتف: 0782633162 | عمان، المملكة الأردنية الهاشمية
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
