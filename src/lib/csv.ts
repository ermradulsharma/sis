export const exportToCSV = (data: any[], filename: string) => {
  if (!data || !data.length) {
    console.warn("No data to export");
    return;
  }

  // Get headers from first object keys (flattening nested objects if needed in advanced implementations)
  const headers = Object.keys(data[0]);

  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));

  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      let val = row[header];
      
      // Handle objects/arrays roughly
      if (typeof val === 'object' && val !== null) {
        if (val instanceof Date) {
          val = val.toISOString();
        } else if (val.name) {
          val = val.name; // Simple heuristic for populated references like { _id: '..', name: 'John' }
        } else if (val.firstName) {
          val = `${val.firstName} ${val.lastName}`;
        } else {
          val = JSON.stringify(val);
        }
      }

      // Escape quotes and wrap in quotes if there's a comma
      const stringVal = String(val === null || val === undefined ? '' : val).replace(/"/g, '""');
      return `"${stringVal}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  
  // Trigger download
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  
  link.click();
  
  document.body.removeChild(link);
};
