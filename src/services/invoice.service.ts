export class InvoiceServices {
  static printInvoice(params: { id: number }) {
    const iframe = document.createElement("iframe");

    iframe.style.position = "absolute";
    iframe.style.left = "-9999px";
    iframe.src = `/api/invoice/print/${params.id}`;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow?.print();

      iframe.contentWindow?.addEventListener("afterprint", () => {
        iframe.remove();
      });
    };
  }

  static printInvoiceKredit(params: { id: number }) {
    const iframe = document.createElement("iframe");

    iframe.style.position = "absolute";
    iframe.style.left = "-9999px";
    iframe.src = `/api/invoice/print-kredit/${params.id}`;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow?.print();

      iframe.contentWindow?.addEventListener("afterprint", () => {
        iframe.remove();
      });
    };
  }

  static printTempoPayment(params: {
    installmentId: number;
    tempoPaymentIds?: number[];
  }) {
    const iframe = document.createElement("iframe");

    iframe.style.position = "absolute";
    iframe.style.left = "-9999px";

    const query = new URLSearchParams();

    query.set("installmentId", params.installmentId.toString());

    if (params.tempoPaymentIds?.length) {
      params.tempoPaymentIds.forEach((id) => {
        query.append("tempoPaymentIds", id.toString());
      });
    }

    iframe.src = `/api/invoice/print-kredit-payment?${query.toString()}`;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow?.print();

      iframe.contentWindow?.addEventListener("afterprint", () => {
        iframe.remove();
      });
    };
  }

  static printInvoiceBarangMasuk(params: { id: number }) {
    const iframe = document.createElement("iframe");

    iframe.style.position = "absolute";
    iframe.style.left = "-9999px";
    iframe.src = `/api/invoice/print-barang-masuk/${params.id}`;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow?.print();

      iframe.contentWindow?.addEventListener("afterprint", () => {
        iframe.remove();
      });
    };
  }

  static printInvoiceBarangKeluar(params: { id: number }) {
    const iframe = document.createElement("iframe");

    iframe.style.position = "absolute";
    iframe.style.left = "-9999px";
    iframe.src = `/api/invoice/print-barang-keluar/${params.id}`;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow?.print();

      iframe.contentWindow?.addEventListener("afterprint", () => {
        iframe.remove();
      });
    };
  }
}
