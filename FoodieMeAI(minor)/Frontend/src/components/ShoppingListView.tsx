import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Trash2,
  Check,
  Copy,
  Printer,
  CheckCircle2,
  AlertCircle,
  Share2,
  FileDown,
  Sparkles,
} from 'lucide-react';
import { ShoppingListItem, IngredientCategory } from '../types';

interface ShoppingListViewProps {
  items: ShoppingListItem[];
  onUpdateItems: (items: ShoppingListItem[]) => void;
  onClearChecked: () => void;
  onClearAll: () => void;
}

const CATEGORY_NAMES: Record<IngredientCategory, { label: string; icon: string }> = {
  produce: { label: 'Fresh Produce', icon: '🥦' },
  meat_seafood: { label: 'Meat & Seafood', icon: '🥩' },
  dairy: { label: 'Dairy & Eggs', icon: '🧀' },
  pantry: { label: 'Pantry & Dry Goods', icon: '🥫' },
  spices_oils: { label: 'Oils, Vinegars & Spices', icon: '🧂' },
  bakery: { label: 'Bakery & Bread', icon: '🍞' },
  frozen: { label: 'Frozen Goods', icon: '🧊' },
  other: { label: 'Miscellaneous', icon: '🛒' },
};

export const ShoppingListView: React.FC<ShoppingListViewProps> = ({
  items,
  onUpdateItems,
  onClearChecked,
  onClearAll,
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState<number>(1);
  const [newItemUnit, setNewItemUnit] = useState('item');
  const [newItemCategory, setNewItemCategory] = useState<IngredientCategory>('produce');
  const [copied, setCopied] = useState(false);

  const toggleCheck = (id: string) => {
    const updated = items.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it));
    onUpdateItems(updated);
  };

  const removeItem = (id: string) => {
    onUpdateItems(items.filter((it) => it.id !== id));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: ShoppingListItem = {
      id: `custom-${Date.now()}`,
      name: newItemName.trim(),
      amount: Number(newItemAmount) || 1,
      unit: newItemUnit.trim() || 'item',
      category: newItemCategory,
      checked: false,
    };

    onUpdateItems([...items, newItem]);
    setNewItemName('');
    setNewItemAmount(1);
    setNewItemUnit('item');
  };

  const copyListToClipboard = () => {
    const lines = ['🛒 FoodieMe - Smart Grocery Shopping List', ''];
    const grouped = groupByCategory(items);

    Object.entries(grouped).forEach(([catKey, catItems]) => {
      const catInfo = CATEGORY_NAMES[catKey as IngredientCategory] || { label: catKey, icon: '•' };
      lines.push(`${catInfo.icon} ${catInfo.label.toUpperCase()}`);
      catItems.forEach((it) => {
        lines.push(`  [${it.checked ? 'X' : ' '}] ${it.amount} ${it.unit} ${it.name}`);
      });
      lines.push('');
    });

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const printShoppingList = () => {
    window.print();
  };

  const groupByCategory = (itemList: ShoppingListItem[]) => {
    const groups: Record<string, ShoppingListItem[]> = {};
    itemList.forEach((it) => {
      const cat = it.category || 'other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(it);
    });
    return groups;
  };

  const checkedCount = items.filter((i) => i.checked).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;
  const groupedItems = groupByCategory(items);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#e8e2d8] shadow-xs p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#b46039] uppercase tracking-wider mb-1">
              <ShoppingBag className="w-4 h-4" />
              <span>Step 5: One-Click Grocery Checklist</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#3d3a35]">
              Interactive Shopping List
            </h2>
            <p className="text-xs sm:text-sm text-[#756e65] mt-1">
              Categorized list of ingredients missing from your refrigerator to complete your recipes.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={copyListToClipboard}
              disabled={items.length === 0}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#faf8f5] hover:bg-[#f2eee9] text-[#3d3a35] border border-[#e8e2d8] transition-colors flex items-center shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5 text-[#889e81]" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1.5 text-[#756e65]" />
                  Copy Text
                </>
              )}
            </button>

            <button
              onClick={printShoppingList}
              disabled={items.length === 0}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#3d3a35] hover:bg-[#2b2925] text-[#fcfaf7] transition-colors flex items-center shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Print List
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {totalCount > 0 && (
          <div className="mt-6 pt-5 border-t border-[#e8e2d8]">
            <div className="flex justify-between text-xs font-semibold text-[#59534c] mb-1.5">
              <span>Shopping Progress</span>
              <span>
                {checkedCount} of {totalCount} items gathered ({progressPercent}%)
              </span>
            </div>
            <div className="h-2 w-full bg-[#f2eee9] rounded-full overflow-hidden">
              <div
                style={{ width: `${progressPercent}%` }}
                className="h-full bg-[#889e81] transition-all duration-300 rounded-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Add Custom Item Field */}
      <div className="bg-white rounded-2xl border border-[#e8e2d8] shadow-xs p-5">
        <h3 className="text-xs font-bold text-[#3d3a35] uppercase tracking-wider mb-3 flex items-center">
          <Plus className="w-3.5 h-3.5 mr-1 text-[#d68c6a]" />
          Add Custom Store Item
        </h3>
        <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Item name (e.g. Greek Feta Cheese, Fresh Cilantro)..."
            className="sm:col-span-5 px-3.5 py-2 rounded-xl border border-[#dfd8ce] text-xs text-[#3d3a35] focus:outline-none focus:ring-2 focus:ring-[#d68c6a]"
          />
          <input
            type="number"
            min="0.1"
            step="0.5"
            value={newItemAmount}
            onChange={(e) => setNewItemAmount(Number(e.target.value))}
            placeholder="Qty"
            className="sm:col-span-2 px-3 py-2 rounded-xl border border-[#dfd8ce] text-xs text-[#3d3a35] focus:outline-none focus:ring-2 focus:ring-[#d68c6a]"
          />
          <input
            type="text"
            value={newItemUnit}
            onChange={(e) => setNewItemUnit(e.target.value)}
            placeholder="Unit (e.g. block, oz)"
            className="sm:col-span-2 px-3 py-2 rounded-xl border border-[#dfd8ce] text-xs text-[#3d3a35] focus:outline-none focus:ring-2 focus:ring-[#d68c6a]"
          />
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value as any)}
            className="sm:col-span-2 px-2 py-2 rounded-xl border border-[#dfd8ce] text-xs text-[#3d3a35] bg-white focus:outline-none focus:ring-2 focus:ring-[#d68c6a]"
          >
            <option value="produce">Produce</option>
            <option value="meat_seafood">Meat/Fish</option>
            <option value="dairy">Dairy</option>
            <option value="pantry">Pantry</option>
            <option value="spices_oils">Spices/Oils</option>
            <option value="bakery">Bakery</option>
            <option value="other">Other</option>
          </select>
          <button
            type="submit"
            className="sm:col-span-1 px-3 py-2 bg-[#d68c6a] hover:bg-[#b46039] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center shadow-xs"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Categorized List Content */}
      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e8e2d8] shadow-xs p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#faf2ec] text-[#b46039] flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-base font-serif font-bold text-[#3d3a35]">Your Shopping List is Empty</h3>
          <p className="text-xs text-[#756e65] max-w-md mx-auto mt-1">
            Generate a recipe to automatically extract missing store ingredients, or add your own pantry items above.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-semibold text-[#756e65]">
              Categorized Aisle Items ({items.length})
            </span>
            <div className="flex space-x-3 text-xs">
              <button
                onClick={onClearChecked}
                disabled={checkedCount === 0}
                className="text-[#756e65] hover:text-[#b46039] font-medium disabled:opacity-40 transition-colors"
              >
                Clear Checked ({checkedCount})
              </button>
              <span className="text-[#dfd8ce]">•</span>
              <button
                onClick={onClearAll}
                className="text-[#9c9489] hover:text-[#b46039] font-medium transition-colors"
              >
                Delete All
              </button>
            </div>
          </div>

          {Object.entries(groupedItems).map(([catKey, catItems]) => {
            const catInfo = CATEGORY_NAMES[catKey as IngredientCategory] || {
              label: 'Miscellaneous',
              icon: '🛒',
            };
            return (
              <div
                key={catKey}
                className="bg-white rounded-2xl border border-[#e8e2d8] shadow-xs overflow-hidden"
              >
                <div className="bg-[#faf8f5] px-5 py-3 border-b border-[#e8e2d8] flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-base">{catInfo.icon}</span>
                    <h4 className="text-xs font-bold text-[#3d3a35] uppercase tracking-wider">
                      {catInfo.label}
                    </h4>
                  </div>
                  <span className="text-[11px] text-[#756e65] font-medium">
                    {catItems.filter((i) => i.checked).length}/{catItems.length} checked
                  </span>
                </div>

                <div className="p-3 divide-y divide-[#f2eee9]">
                  {catItems.map((item) => (
                    <div
                      key={item.id}
                      className={`py-2.5 px-3 rounded-xl flex items-center justify-between transition-colors ${
                        item.checked ? 'bg-[#faf8f5]/80 text-[#9c9489]' : 'hover:bg-[#faf2ec]/50 text-[#3d3a35]'
                      }`}
                    >
                      <div
                        onClick={() => toggleCheck(item.id)}
                        className="flex items-center space-x-3 flex-1 cursor-pointer"
                      >
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            item.checked
                              ? 'bg-[#889e81] border-[#889e81] text-white'
                              : 'border-[#dfd8ce] bg-white'
                          }`}
                        >
                          {item.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div className="text-xs">
                          <span
                            className={`font-semibold ${
                              item.checked ? 'line-through text-[#9c9489]' : 'text-[#3d3a35]'
                            }`}
                          >
                            {item.amount} {item.unit} {item.name}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#c4bdb2] hover:text-[#b46039] p-1 rounded-lg transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
