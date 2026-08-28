import React, { useState } from 'react';
import { TravelPlan } from '../types/travel';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';
import {
  X,
  Download,
  FileText,
  Code,
  Copy,
  Printer,
  Check,
  Sparkles,
  Plane,
  Building,
  Car,
} from 'lucide-react';

interface ExportModalProps {
  plan: TravelPlan;
  currency: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  plan,
  currency,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!isOpen) return null;

  // 1. Generate & Download PDF
  const handleDownloadPdf = () => {
    try {
      setIsGeneratingPdf(true);
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Title & Branding
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 40, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('SmartRide AI — Autonomous Travel Package', 14, 18);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(52, 211, 153); // emerald-400
      doc.text(`${plan.tripTitle} (${plan.startDate} to ${plan.endDate})`, 14, 28);

      doc.setTextColor(203, 213, 225);
      doc.setFontSize(9);
      doc.text(`Travelers: ${plan.travelersCount} | Style: ${plan.travelStyle} | Budget: ${currency} ${plan.budgetSummary.totalBudget}`, 14, 35);

      // Section: Budget & Overview
      let y = 50;
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('1. Trip Overview & Budget Summary', 14, y);

      y += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`• Total Projected Cost: ${currency} ${plan.budgetSummary.estimatedTotal}`, 16, y);
      y += 6;
      doc.text(`• SmartRide Cab Budget: ${currency} ${plan.budgetSummary.allocations.rides} (Savings: ${currency} ${plan.budgetSummary.savingsFromSmartRides})`, 16, y);
      y += 6;
      doc.text(`• Weather Summary: ${plan.overallWeatherSummary}`, 16, y);

      // Section: Flights & Hotel
      y += 12;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('2. Flight & Accommodation Reservations', 14, y);

      y += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      if (plan.selectedFlight) {
        doc.text(`• Flight: ${plan.selectedFlight.airline} (${plan.selectedFlight.flightNumber}) - ${plan.selectedFlight.origin} to ${plan.selectedFlight.destination} | Fare: ${currency} ${plan.selectedFlight.price}`, 16, y);
        y += 6;
      }
      if (plan.selectedHotel) {
        doc.text(`• Stay: ${plan.selectedHotel.name} (${plan.selectedHotel.stars} Stars) | ${currency} ${plan.selectedHotel.pricePerNight}/night (Total: ${currency} ${plan.selectedHotel.totalPrice})`, 16, y);
        y += 6;
      }

      // Section: Day-by-Day Itinerary
      y += 10;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('3. Daily Itineraries & SmartRide Transit Legs', 14, y);

      plan.days.forEach((day) => {
        y += 8;
        if (y > 260) {
          doc.addPage();
          y = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(5, 150, 105);
        doc.text(`Day ${day.dayNumber}: ${day.title} (${day.date})`, 14, y);

        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);

        [...day.morning, ...day.afternoon, ...day.evening].forEach((act) => {
          y += 5;
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
          doc.text(`- [${act.time}] ${act.title} (${act.location}) - Cost: ${currency} ${act.estimatedCost}`, 18, y);

          if (act.rideToNext) {
            y += 4;
            doc.setTextColor(100, 116, 139);
            doc.text(`   🚕 SmartRide: ${act.rideToNext.recommendedTier} (${act.rideToNext.distanceKm}km, ${act.rideToNext.durationMins}m) ~ ${currency} ${act.rideToNext.estimatedFare}`, 18, y);
            doc.setTextColor(15, 23, 42);
          }
        });
      });

      // Save PDF
      doc.save(`SmartRide_Travel_Package_${plan.destination.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
      confetti({ particleCount: 50, spread: 60 });
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // 2. Download JSON
  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(plan, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SmartRide_Itinerary_${plan.destination.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 3. Copy Markdown
  const handleCopyMarkdown = () => {
    let md = `# 🗺️ SmartRide AI Travel Itinerary: ${plan.tripTitle}\n\n`;
    md += `**Dates:** ${plan.startDate} to ${plan.endDate} (${plan.durationDays} Days)\n`;
    md += `**Travelers:** ${plan.travelersCount} | **Style:** ${plan.travelStyle}\n`;
    md += `**Projected Cost:** ${currency} ${plan.budgetSummary.estimatedTotal} / ${currency} ${plan.budgetSummary.totalBudget}\n\n`;

    md += `### 🏨 Bookings\n`;
    if (plan.selectedFlight) md += `- **Flight:** ${plan.selectedFlight.airline} (${plan.selectedFlight.flightNumber}) - ${currency} ${plan.selectedFlight.price}\n`;
    if (plan.selectedHotel) md += `- **Hotel:** ${plan.selectedHotel.name} - ${currency} ${plan.selectedHotel.totalPrice}\n\n`;

    md += `### 📅 Daily Schedule & SmartRide Routing\n`;
    plan.days.forEach((d) => {
      md += `\n#### Day ${d.dayNumber}: ${d.title} (${d.date})\n`;
      [...d.morning, ...d.afternoon, ...d.evening].forEach((act) => {
        md += `- **${act.time}**: ${act.title} - ${currency} ${act.estimatedCost}\n`;
        if (act.rideToNext) {
          md += `  > 🚕 *SmartRide*: ${act.rideToNext.recommendedTier} (${act.rideToNext.distanceKm} km, ~${currency} ${act.rideToNext.estimatedFare})\n`;
        }
      });
    });

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Export Travel Package</h3>
              <p className="text-xs text-slate-500">Export verified itinerary, ride estimates & booking package</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {/* PDF Download */}
          <button
            id="btn-download-pdf"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="w-full p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition text-left flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                  Export as PDF Travel Package
                </h4>
                <p className="text-[11px] text-slate-500">
                  Complete print-ready PDF with daily tables, bookings & transit legs
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
          </button>

          {/* JSON Schema */}
          <button
            id="btn-download-json"
            onClick={handleDownloadJson}
            className="w-full p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition text-left flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-800">
                  Download Structured JSON Data
                </h4>
                <p className="text-[11px] text-slate-500">
                  Pydantic-compliant schema with full coordinate arrays and trace steps
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
          </button>

          {/* Copy Markdown */}
          <button
            id="btn-copy-markdown"
            onClick={handleCopyMarkdown}
            className="w-full p-4 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/40 transition text-left flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-800">
                  {copied ? 'Markdown Copied to Clipboard!' : 'Copy Formatted Markdown'}
                </h4>
                <p className="text-[11px] text-slate-500">
                  Shareable text summary ready for Notion, WhatsApp or email
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-purple-600">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
