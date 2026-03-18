import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUniqueTicketId() {
  return "HARM-" + Math.random().toString(36).substring(2, 9).toUpperCase();
}

export function validateTransactionId(method: string, id: string) {
  if (method === "Telebirr") {
    return `https://transactioninfo.ethiotelecom.et/receipt/${id}`;
  }
  if (method === "CBE Birr") {
    return `https://apps.cbe.com.et:100/?id=${id}`;
  }
  return null;
}

export function isTicketExpired(eventDate: string) {
  const today = new Date();
  const event = new Date(eventDate);
  return today > event;
}

export function formatDate(dateString: string) {
  if (!dateString) return "TBD";
  try {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  } catch (e) {
    return "Invalid Date";
  }
}

export function formatCurrency(amount: number) {
  return amount.toLocaleString() + " ETB";
}

export const downloadAsImage = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Element with id ${elementId} not found`);
    return;
  }
  
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      allowTaint: true
    });
    
    if (canvas && typeof canvas.toDataURL === 'function') {
      const data = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      
      link.href = data;
      link.download = `${fileName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error("html2canvas did not return a valid canvas element or environment doesn't support toDataURL");
    }
  } catch (error) {
    console.error("Error generating image:", error);
  }
};

export const downloadAsPDF = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Element with id ${elementId} not found`);
    return;
  }

  try {
    const canvas = await html2canvas(element, { 
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      allowTaint: true
    });
    
    if (canvas && typeof canvas.toDataURL === 'function') {
      const imgData = canvas.toDataURL("image/png");
      
      // canvas.width and height are already scaled by 2
      const pdfWidth = canvas.width / 2;
      const pdfHeight = canvas.height / 2;

      // Use a more standard jsPDF initialization
      const pdf = new jsPDF({
        orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
        unit: "px",
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${fileName}.pdf`);
    } else {
      console.error("html2canvas did not return a valid canvas element or environment doesn't support toDataURL");
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

// Aliases for compatibility with different components
export const downloadTicketAsPdf = downloadAsPDF;
export const downloadImage = downloadAsImage;