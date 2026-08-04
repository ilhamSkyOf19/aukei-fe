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
}
