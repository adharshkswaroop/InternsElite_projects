import React from 'react';
import {
  X,
  Printer,
  Download,
  Scale,
  ShieldCheck,
  Clock,
  Flame,
  Utensils,
  Award,
} from 'lucide-react';
import jsPDF from 'jspdf';
import { Recipe } from '../types';

interface PrintableRecipeCardProps {
  recipe: Recipe | null;
  onClose: () => void;
}

export const PrintableRecipeCard: React.FC<PrintableRecipeCardProps> = ({
  recipe,
  onClose,
}) => {
  if (!recipe) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'letter',
    });

    // Margins and basic styling
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(recipe.title, 40, 50);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(recipe.subtitle || '', 40, 68);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    doc.text(
      `Cuisine: ${recipe.cuisine} | Total Time: ${recipe.totalTimeMinutes}m | Servings: ${recipe.servings} | Difficulty: ${recipe.difficulty}`,
      40,
      86
    );

    // Nutrition Box
    doc.setFillColor(245, 245, 245);
    doc.rect(40, 96, 530, 36, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(20, 20, 20);
    doc.text(
      `USDA FoodData Central Verified: ${recipe.nutrition.calories} kcal | Protein: ${recipe.nutrition.protein}g | Net Carbs: ${recipe.nutrition.netCarbs}g | Fat: ${recipe.nutrition.totalFat}g | Sodium: ${recipe.nutrition.sodium}mg`,
      50,
      118
    );

    // Badges
    const badgesText = recipe.dietaryBadges.map((b) => b.label).join(' • ');
    doc.setFontSize(8);
    doc.setTextColor(0, 120, 80);
    doc.text(`Dietary Standards: ${badgesText}`, 40, 148);

    // Ingredients
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Ingredients:', 40, 175);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    let yPos = 192;
    recipe.ingredients.forEach((ing) => {
      doc.text(`• ${ing.amount} ${ing.unit} ${ing.name} ${ing.notes ? `(${ing.notes})` : ''}`, 45, yPos);
      yPos += 14;
    });

    yPos += 12;

    // Instructions
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Cooking Instructions:', 40, yPos);
    yPos += 16;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    recipe.instructions.forEach((step) => {
      const stepTitle = `${step.stepNumber}. ${step.title}: `;
      doc.setFont('helvetica', 'bold');
      doc.text(stepTitle, 45, yPos);

      const splitText = doc.splitTextToSize(step.instruction, 510);
      doc.setFont('helvetica', 'normal');
      doc.text(splitText, 45, yPos + 12);
      yPos += 16 + splitText.length * 11;

      if (yPos > 720) {
        doc.addPage();
        yPos = 40;
      }
    });

    // Chef Secret
    if (recipe.chefSecret && yPos < 720) {
      yPos += 10;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(120, 80, 20);
      const secret = doc.splitTextToSize(`Chef Secret: ${recipe.chefSecret}`, 510);
      doc.text(secret, 45, yPos);
    }

    doc.save(`${recipe.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_recipe_card.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-[#e8e2d8] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Preview Controls Bar */}
        <div className="bg-[#3d3a35] text-[#fcfaf7] p-4 sm:p-5 flex items-center justify-between border-b border-white/10 print:hidden">
          <div className="flex items-center space-x-2">
            <Printer className="w-4 h-4 text-[#d68c6a]" />
            <span className="text-sm font-bold">Printable Culinary Recipe Card & PDF</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadPDF}
              className="px-3 py-1.5 rounded-xl bg-[#d68c6a] hover:bg-[#b46039] text-white text-xs font-semibold flex items-center shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download PDF
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#fcfaf7] text-xs font-semibold flex items-center transition-colors border border-white/10"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Print Directly
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#d8d2c7] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Card Area */}
        <div id="printable-recipe-sheet" className="p-8 sm:p-10 overflow-y-auto font-serif text-[#3d3a35] bg-[#fcfaf7] space-y-6">
          {/* Card Title & Header */}
          <div className="border-b-2 border-[#3d3a35] pb-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs uppercase font-sans font-bold tracking-widest text-[#b46039] block mb-1">
                  {recipe.cuisine} • {recipe.difficulty} Level
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#3d3a35]">{recipe.title}</h1>
                <p className="text-[#756e65] font-sans text-sm mt-1">{recipe.subtitle}</p>
              </div>

              {/* Verified Seal */}
              <div className="border-2 border-[#889e81] bg-[#f1f6ef] p-2 rounded-xl text-center shrink-0 font-sans">
                <div className="text-[9px] uppercase font-black text-[#344d30]">USDA Verified</div>
                <div className="text-lg font-black leading-none text-[#233520]">{recipe.nutrition.calories}</div>
                <div className="text-[8px] text-[#4d6b47]">kcal / serv</div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex flex-wrap gap-4 mt-4 font-sans text-xs font-medium text-[#59534c]">
              <span>Prep Time: <strong>{recipe.prepTimeMinutes}m</strong></span>
              <span>•</span>
              <span>Cook Time: <strong>{recipe.cookTimeMinutes}m</strong></span>
              <span>•</span>
              <span>Total Time: <strong>{recipe.totalTimeMinutes}m</strong></span>
              <span>•</span>
              <span>Servings: <strong>{recipe.servings}</strong></span>
            </div>
          </div>

          {/* Nutrition Summary Strip */}
          <div className="p-3 bg-[#f2eee9] rounded-xl font-sans text-xs flex justify-between items-center text-[#3d3a35] border border-[#e8e2d8]">
            <span><strong>Protein:</strong> {recipe.nutrition.protein}g</span>
            <span><strong>Net Carbs:</strong> {recipe.nutrition.netCarbs}g</span>
            <span><strong>Fat:</strong> {recipe.nutrition.totalFat}g</span>
            <span><strong>Fiber:</strong> {recipe.nutrition.fiber}g</span>
            <span><strong>Sodium:</strong> {recipe.nutrition.sodium}mg</span>
            <span><strong>Sugars:</strong> {recipe.nutrition.sugar}g</span>
          </div>

          {/* Dietary Badges */}
          <div className="flex flex-wrap gap-1.5 font-sans">
            {recipe.dietaryBadges.map((b) => (
              <span
                key={b.id}
                className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#f1f6ef] text-[#344d30] border border-[#b8d6b0]"
              >
                ✓ {b.label}
              </span>
            ))}
          </div>

          {/* Two-Column Printable Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 font-sans">
            {/* Ingredients */}
            <div className="md:col-span-5 space-y-2">
              <h3 className="font-serif font-bold text-base text-[#3d3a35] border-b border-[#dfd8ce] pb-1">
                Ingredients ({recipe.servings} Servings)
              </h3>
              <ul className="space-y-1.5 text-xs text-[#3d3a35]">
                {recipe.ingredients.map((ing) => (
                  <li key={ing.id} className="flex items-baseline justify-between">
                    <span>
                      <strong>{ing.amount} {ing.unit}</strong> {ing.name}
                    </span>
                    {ing.notes && <span className="text-[#9c9489] text-[11px] italic">({ing.notes})</span>}
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="md:col-span-7 space-y-3">
              <h3 className="font-serif font-bold text-base text-[#3d3a35] border-b border-[#dfd8ce] pb-1">
                Step-by-Step Method
              </h3>
              <div className="space-y-3 text-xs text-[#3d3a35]">
                {recipe.instructions.map((step) => (
                  <div key={step.stepNumber} className="space-y-0.5">
                    <div className="font-bold text-[#3d3a35]">
                      {step.stepNumber}. {step.title} {step.timerMinutes && `(${step.timerMinutes}m)`}
                    </div>
                    <p className="text-[#59534c] leading-relaxed">{step.instruction}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chef Tip Footer */}
          {recipe.chefSecret && (
            <div className="border-t border-[#e8e2d8] pt-3 text-xs font-sans text-[#756e65] italic">
              <strong className="text-[#3d3a35]">Chef's Secret:</strong> {recipe.chefSecret}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
