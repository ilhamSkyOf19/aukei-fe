import instanceAxios from "../libs/axios";

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

  // DOWNLOAD
  // download pdf
  static async downloadInvoiceTransaksiPdf(id: number): Promise<Blob> {
    const response = await instanceAxios.get(`/invoice/${id}/transaksi-pdf`, {
      responseType: "blob",
    });

    return response.data;
  }

  // download invoice kredit
  static async downloadInvoiceKreditPdf(id: number): Promise<Blob> {
    const response = await instanceAxios.get(`/invoice/kredit/${id}/pdf`, {
      responseType: "blob",
    });

    return response.data;
  }

  // download invoice barang masuk
  static async downloadInvoiceBarangMasukPdf(id: number): Promise<Blob> {
    const response = await instanceAxios.get(
      `/invoice/barang-masuk/${id}/pdf`,
      {
        responseType: "blob",
      },
    );

    return response.data;
  }

  // download invoice barang keluar
  static async downloadInvoiceBarangKeluarPdf(id: number): Promise<Blob> {
    const response = await instanceAxios.get(
      `/invoice/barang-keluar/${id}/pdf`,
      {
        responseType: "blob",
      },
    );

    return response.data;
  }
}
