export function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let value = '';
  let quoted = false;

  for (let index = 0; index < line.length; index++) {
    const character = line[index];
    if (character === '"' && line[index + 1] === '"' && quoted) {
      value += '"';
      index++;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === ',' && !quoted) {
      values.push(value.trim());
      value = '';
    } else {
      value += character;
    }
  }

  values.push(value.trim());
  return values;
}

export function parseDatasetContent(content: string, filename = ''): Record<string, unknown>[] {
  if (filename.toLowerCase().endsWith('.json') || content.trimStart().startsWith('[') || content.trimStart().startsWith('{')) {
    const parsed = JSON.parse(content);
    const records = Array.isArray(parsed) ? parsed : parsed.reviews;
    if (!Array.isArray(records)) throw new Error('JSON must contain an array of reviews.');
    return records;
  }

  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length <= 1) return [];

  const headers = parseCsvLine(lines[0]).map(header => header.toLowerCase().replace(/['"]/g, ''));
  return lines.slice(1).map(line => {
    const row = parseCsvLine(line);
    return headers.reduce<Record<string, unknown>>((record, header, index) => {
      record[header] = row[index] || '';
      return record;
    }, {});
  });
}
