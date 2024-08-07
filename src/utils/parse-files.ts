function convertCSVtoObj(csv: string) {
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

function parseCSVFiles<T>(files: Express.Multer.File[]): {
  name: string;
  content: T[];
}[] {
  const parsedFiles = files.map((file) => {
    const fileData = file.buffer.toString();
    return {
      fileName: file.originalname,
      fileData,
    };
  });

  const formattedFiles = parsedFiles.map((file) => {
    const data = convertCSVtoObj(file.fileData);
    return {
      name: file.fileName,
      content: data,
    };
  });

  return formattedFiles;
}

export { parseCSVFiles };
