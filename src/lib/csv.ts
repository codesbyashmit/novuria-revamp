export function parseCsv<T extends Record<string, string>>(csvText: string): T[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    return [];
  }

  const parseRow = (row: string): string[] => {
    const fields: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === '"') {
        if (inQuotes && row[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current.trim());
    return fields;
  };

  const headers = parseRow(lines[0]);
  const records: T[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseRow(lines[i]);
    const record = {} as Record<string, string>;
    headers.forEach((header, index) => {
      record[header] = values[index] !== undefined ? values[index] : '';
    });
    records.push(record as T);
  }

  return records;
}

export function generateCsv<T extends Record<string, unknown>>(
  records: T[],
  columns: { key: keyof T; label: string }[]
): string {
  const headerLine = columns
    .map((c) => `"${c.label.replace(/"/g, '""')}"`)
    .join(',');

  const rows = records.map((record) =>
    columns
      .map((c) => {
        const val = record[c.key];
        const textVal = val === null || val === undefined ? '' : String(val);
        return `"${textVal.replace(/"/g, '""')}"`;
      })
      .join(',')
  );

  return [headerLine, ...rows].join('\n');
}

