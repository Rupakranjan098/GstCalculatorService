import React, { useState } from 'react';

export default function ExpandableRow({ renderMainRow, renderExpandedContent, colSpan }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <tr 
        onClick={() => setIsExpanded(!isExpanded)}
        className="hover:bg-slate-50/20 cursor-pointer transition-colors"
      >
        {renderMainRow(isExpanded)}
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={colSpan} className="bg-slate-50/45 px-5 py-4 border-t border-b border-slate-100/80">
            {renderExpandedContent()}
          </td>
        </tr>
      )}
    </>
  );
}
