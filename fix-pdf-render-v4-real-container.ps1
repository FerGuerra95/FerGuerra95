$path = ".\src\modules\ma\pages\DealDetailPage.jsx"

if (!(Test-Path $path)) {
  throw "No encuentro el archivo: $path. Ejecuta este script desde la carpeta raiz del proyecto."
}

$content = Get-Content $path -Raw

$newExportFunction = @'
async function exportHtmlAsPdf({ html, fileName }) {
  const html2pdfModule = await import('html2pdf.js');
  const html2pdf = html2pdfModule.default || html2pdfModule;

  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  const sourcePage = parsedDocument.querySelector('.page') || parsedDocument.body;

  if (!sourcePage) {
    throw new Error('No se ha podido preparar el contenido PDF.');
  }

  const exportRoot = document.createElement('div');
  exportRoot.setAttribute('data-ceos-pdf-export', 'true');

  exportRoot.style.position = 'fixed';
  exportRoot.style.left = '-10000px';
  exportRoot.style.top = '0';
  exportRoot.style.width = '1120px';
  exportRoot.style.minHeight = '1600px';
  exportRoot.style.background = '#ffffff';
  exportRoot.style.color = '#0b1220';
  exportRoot.style.zIndex = '2147483647';
  exportRoot.style.pointerEvents = 'none';
  exportRoot.style.opacity = '1';

  const styleNodes = Array.from(parsedDocument.head.querySelectorAll('style'));
  styleNodes.forEach((styleNode) => {
    const clonedStyle = document.createElement('style');
    clonedStyle.textContent = `${styleNode.textContent || ''}

      [data-ceos-pdf-export],
      [data-ceos-pdf-export] * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      [data-ceos-pdf-export] {
        background: #ffffff !important;
      }

      [data-ceos-pdf-export] .page {
        background: #ffffff !important;
        box-shadow: none !important;
        padding: 0 !important;
        border-radius: 0 !important;
      }

      [data-ceos-pdf-export] .cover {
        background:
          radial-gradient(circle at 9% 0%, rgba(96, 165, 250, 0.45), transparent 33%),
          radial-gradient(circle at 94% 8%, rgba(16, 185, 129, 0.26), transparent 30%),
          radial-gradient(circle at 58% 118%, rgba(245, 158, 11, 0.16), transparent 32%),
          linear-gradient(135deg, #020617 0%, #0f172a 54%, #111827 100%) !important;
        color: #ffffff !important;
        box-shadow: none !important;
      }

      [data-ceos-pdf-export] .cover *,
      [data-ceos-pdf-export] .metric strong,
      [data-ceos-pdf-export] .cover-footer strong,
      [data-ceos-pdf-export] .brand-mark,
      [data-ceos-pdf-export] .classification strong {
        color: inherit;
      }

      [data-ceos-pdf-export] .section {
        background: #ffffff !important;
        box-shadow: none !important;
      }

      [data-ceos-pdf-export] .row,
      [data-ceos-pdf-export] .item {
        background: #f8fafc !important;
        box-shadow: none !important;
      }

      [data-ceos-pdf-export] .print-toolbar {
        display: none !important;
      }
    `;
    exportRoot.appendChild(clonedStyle);
  });

  const pageClone = sourcePage.cloneNode(true);
  exportRoot.appendChild(pageClone);
  document.body.appendChild(exportRoot);

  await new Promise((resolve) => window.requestAnimationFrame(resolve));
  await new Promise((resolve) => window.requestAnimationFrame(resolve));
  await new Promise((resolve) => window.setTimeout(resolve, 450));

  const options = {
    margin: [0.18, 0.18, 0.18, 0.18],
    filename: fileName,
    image: {
      type: 'jpeg',
      quality: 1
    },
    html2canvas: {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 1120,
      onclone: (clonedDoc) => {
        clonedDoc.documentElement.style.background = '#ffffff';
        clonedDoc.body.style.background = '#ffffff';

        const clonedExportRoot = clonedDoc.querySelector('[data-ceos-pdf-export]');
        if (clonedExportRoot) {
          clonedExportRoot.style.left = '0';
          clonedExportRoot.style.top = '0';
          clonedExportRoot.style.background = '#ffffff';
        }

        clonedDoc.querySelectorAll('.print-toolbar').forEach((node) => {
          node.remove();
        });
      }
    },
    jsPDF: {
      unit: 'in',
      format: 'a4',
      orientation: 'portrait',
      compress: true
    },
    pagebreak: {
      mode: ['css', 'legacy'],
      avoid: ['.cover', '.section', '.item', '.row', '.grid', '.metric']
    }
  };

  try {
    await html2pdf().set(options).from(pageClone).save();
  } finally {
    exportRoot.remove();
  }
}

'@

$pattern = "async function exportHtmlAsPdf\(\{ html, fileName \}\) \{[\s\S]*?\r?\n\}\r?\n\r?\nfunction buildDataRoomHtml\(deal\) \{"

if ($content -notmatch $pattern) {
  throw "No encuentro la funcion exportHtmlAsPdf seguida de buildDataRoomHtml. Puede que el archivo haya cambiado. Pasame el tramo de exportHtmlAsPdf y te lo ajusto."
}

$content = [regex]::Replace(
  $content,
  $pattern,
  $newExportFunction + "function buildDataRoomHtml(deal) {",
  1
)

Set-Content $path $content -Encoding UTF8

Write-Host "Compilando proyecto..."
npm run build

Write-Host "Listo. Arranca npm start y prueba de nuevo Export Brief PDF / Export IC PDF / Export Data Room PDF."
