import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

export const exportChart = (chartRef: React.RefObject<HTMLDivElement>) => {
  if (chartRef.current) {
    html2canvas(chartRef.current).then(canvas => {
      canvas.toBlob(blob => {
        if (blob) {
          saveAs(blob, 'chart.png');
        }
      });
    });
  }
};
