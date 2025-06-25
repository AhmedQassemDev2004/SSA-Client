/**
 * Converts an array of objects into a CSV string
 */
export function convertToCSV(items: any[]): string {
  if (items.length === 0) {
    return '';
  }

  // Get headers from first item
  const headers = Object.keys(items[0]);
  
  // Create CSV header row
  const csvRows = [
    headers.join(',')
  ];

  // Add data rows
  for (const item of items) {
    const values = headers.map(header => {
      const val = item[header];
      // Handle null/undefined
      if (val == null) return '';
      // Wrap strings with quotes and escape existing quotes
      if (typeof val === 'string') return `"${val.replace(/"/g, '""')}"`;
      // Handle arrays (like images)
      if (Array.isArray(val)) return `"${val.join(';')}"`;
      return val;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

/**
 * Downloads data as a CSV file
 */
export function downloadCSV(data: string, filename: string): void {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  // Create download URL
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  
  // Append to document, click, and cleanup
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
