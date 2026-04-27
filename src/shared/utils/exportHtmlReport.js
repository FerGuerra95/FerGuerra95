export function exportHtmlReport({ title, html }) {
  const printWindow = window.open('', '_blank', 'width=1100,height=800');
  if (!printWindow) return false;

  printWindow.document.open();
  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
      </head>
      <body>${html}</body>
    </html>
  `);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 350);
  return true;
}
