import { GlobalWorkerOptions } from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.js';

GlobalWorkerOptions.workerSrc = pdfWorker;
