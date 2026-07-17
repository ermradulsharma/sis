export const generatePDF = async (elementId: string, filename: string = 'document.pdf') => {
  // We dynamically import html2pdf only on the client side
  if (typeof window === 'undefined') return;

  try {
    const html2pdf = (await import('html2pdf.js')).default;
    const element = document.getElementById(elementId);
    
    if (!element) {
      console.error(`Element with id ${elementId} not found`);
      return;
    }

    const opt = {
      margin:       10,
      filename:     filename,
      image:        { type: 'jpeg' as 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Temporarily add a class to adjust styling for print if needed
    element.classList.add('pdf-export-mode');
    
    await html2pdf().set(opt as any).from(element).save();
    
    element.classList.remove('pdf-export-mode');
    
    return true;
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    return false;
  }
};
