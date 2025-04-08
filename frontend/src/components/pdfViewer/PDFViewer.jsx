import React, { useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

const PDFViewer = ({ url }) => {
  useEffect(() => {
    // Configura el worker para que use el archivo '.mjs'
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs", // Usando el archivo '.mjs'
      import.meta.url // Asegúrate de usar el import.meta.url para cargarlo desde el contexto correcto
    ).toString();
  }, []);

  return (
    <div className="pdf-viewer">
      <Document file={url}>
        <Page pageNumber={1} />
      </Document>
    </div>
  );
};

export default PDFViewer;
