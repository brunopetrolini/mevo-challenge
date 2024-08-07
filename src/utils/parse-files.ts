function convertCSVtoJSON(csv: string) {
  const rows = csv.split('\n');

  const result = [];
  const headers = rows[0].split(';');

  for (let row = 1; row < rows.length; row++) {
    const obj = {};
    const currentLine = rows[row].split(';');

    for (let header = 0; header < headers.length; header++) {
      obj[headers[header]] = currentLine[header];
    }

    result.push(obj);
  }

  return result;
}

function parseCSVFiles<T>(files: Express.Multer.File[]): T {
  const stringifiedFiles = files.map((file) => file.buffer.toString());
  const data = stringifiedFiles.map((file) => convertCSVtoJSON(file));
  return data as T;
}

export { parseCSVFiles };
