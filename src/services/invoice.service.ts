import instanceAxios from "../libs/axios";

export class InvoiceServices {
  // print invoice
  static async printInvoice(params: { id: number }) {
    const response = await instanceAxios.get(`/invoice/print/${params.id}`, {
      responseType: "text",
    });

    const iframe = document.createElement("iframe");

    iframe.style.position = "fixed";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.left = "-9999px";

    iframe.srcdoc = response.data;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    };

    iframe.contentWindow?.addEventListener("afterprint", () => {
      iframe.remove();
    });
  }

  // print invoice kredit
  static async printInvoiceKredit(params: { id: number }) {
    const response = await instanceAxios.get(
      `/invoice/print-kredit/${params.id}`,
      {
        responseType: "text",
      },
    );

    const iframe = document.createElement("iframe");

    iframe.style.position = "fixed";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.left = "-9999px";

    iframe.srcdoc = response.data;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    };

    iframe.contentWindow?.addEventListener("afterprint", () => {
      iframe.remove();
    });
  }

  // print tempo payment
  static async printTempoPayment(params: { installmentId: number }) {
    const response = await instanceAxios.get(
      `/invoice/print-kredit-payment/${params.installmentId}`,
      {
        responseType: "text",
      },
    );

    const iframe = document.createElement("iframe");

    iframe.style.position = "fixed";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.left = "-9999px";

    iframe.srcdoc = response.data;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    };

    iframe.contentWindow?.addEventListener("afterprint", () => {
      iframe.remove();
    });
  }

  // print invoice barang masuk
  static async printInvoiceBarangMasuk(params: { id: number }) {
    const response = await instanceAxios.get(
      `/invoice/print-barang-masuk/${params.id}`,
      {
        responseType: "text",
      },
    );

    const iframe = document.createElement("iframe");

    iframe.style.position = "fixed";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.left = "-9999px";

    iframe.srcdoc = response.data;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    };

    iframe.contentWindow?.addEventListener("afterprint", () => {
      iframe.remove();
    });
  }

  // print invoice barang keluar
  static async printInvoiceBarangKeluar(params: { id: number }) {
    const result = await instanceAxios.get(
      `/invoice/print-barang-keluar/${params.id}`,
      {
        responseType: "text",
      },
    );

    const iframe = document.createElement("iframe");

    iframe.style.position = "fixed";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.left = "-9999px";

    iframe.srcdoc = result.data;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    };

    iframe.contentWindow?.addEventListener("afterprint", () => {
      iframe.remove();
    });
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

  // download invoice kredit payment
  static async downloadInvoiceKreditPaymentPdf(id: number): Promise<Blob> {
    const response = await instanceAxios.get(
      `/invoice/kredit-payment/${id}/pdf`,
      {
        responseType: "blob",
      },
    );

    return response.data;
  }
}
