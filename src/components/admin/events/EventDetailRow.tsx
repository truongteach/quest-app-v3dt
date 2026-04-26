
/**
 * EventDetailRow.tsx
 * 
 * Purpose: Renders the hidden diagnostic details for a specific site event.
 * Used by: src/components/admin/EventsTab.tsx
 * Props:
 *   - event: any — the event registry object
 */

import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Info } from 'lucide-react';

export function EventDetailRow({ event }: { event: any }) {
  const formatValue = (val: any) => {
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val || 'N/A');
  };

  /**
   * REGISTRY DEFENSE PROTOCOL
   * 
   * Safely parses event details. Handles both JSON strings and plain text
   * to prevent terminal SyntaxErrors during forensic audit.
   */
  const getParsedDetails = (input: any) => {
    if (!input) return {};
    if (typeof input === 'object') return input;
    
    const str = String(input).trim();
    if (!str) return {};
    
    // Check if string looks like JSON before parsing
    if (str.startsWith('{') || str.startsWith('[')) {
      try {
        return JSON.parse(str);
      } catch (e) {
        // Fallback for malformed JSON
        return { info: str };
      }
    }
    
    // Return as plain info if not a JSON string
    return { info: str };
  };

  const details = getParsedDetails(event.details);

  return (
    <TableRow className="bg-slate-50/30 border-b border-slate-100">
      <TableCell colSpan={5} className="p-8 px-12">
        <div className="bg-white rounded-[2rem] p-8 border shadow-inner space-y-6">
          <div className="flex items-center gap-3">
            <Info className="w-4 h-4 text-primary" />
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Diagnostic Details</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
            {Object.entries(details || {}).map(([key, value]) => (
              <div key={key} className="flex gap-4 text-[11px] py-1 border-b last:border-none">
                <span className="font-black uppercase tracking-widest text-slate-400 min-w-[140px]">{key.replace(/_/g, ' ')}:</span>
                <span className="text-slate-700 font-bold truncate">{formatValue(value)}</span>
              </div>
            ))}
            <div className="col-span-full pt-4 mt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-6">
              <DetailMini label="Device" value={event.device} />
              <DetailMini label="Browser" value={event.browser} />
              <DetailMini label="Session" value={event.session_id} />
              <DetailMini label="Role" value={event.user_role} />
            </div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}

function DetailMini({ label, value }: any) {
  return (
    <div className="space-y-1">
      <p className="text-[8px] font-black uppercase text-slate-300 tracking-widest">{label}</p>
      <p className="text-[10px] font-bold text-slate-500 truncate">{value || 'N/A'}</p>
    </div>
  );
}
