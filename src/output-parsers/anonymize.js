const regexes = {
  file: /Anonymizing (.+$)/,
  anonymized: /Anonymized file: (.+$)/,
  pixelsAnonymized: /The DICOMPixelAnonymizer returned OK./,
  headersAnonymized: /The DICOMAnonymizer returned OK./,
  skipped: /Skipping (.+): (.+$)/,
  noPixelSignature: /No matching signature found for pixel anonymization./,
  elapsedTime: /Elapsed time: (.+$)/,
};

module.exports = (output) => {
  const result = {
    files: [],
    elapsedTime: null,
  };
  const blocks = output.split('----');

  blocks.forEach((block) => {
    if (!block) return true;
    const parsedBlock = {};
    parsedBlock.raw = block;
    const lines = block.split(/\r?\n/);
    lines.forEach((line) => {
      if (regexes.file.test(line)) {
        [, parsedBlock.file] = regexes.file.exec(line);
        return true;
      }
      if (regexes.anonymized.test(line)) {
        [, parsedBlock.file] = regexes.anonymized.exec(line);
        return true;
      }
      if (regexes.skipped.test(line)) {
        [, parsedBlock.skipped, parsedBlock.file] = regexes.skipped.exec(line);
        parsedBlock.pixelsAnonymized = false;
        parsedBlock.headersAnonymized = false;
        return true;
      }
      if (regexes.noPixelSignature.test(line)) {
        parsedBlock.pixelsAnonymized = false;
        return true;
      }
      if (regexes.pixelsAnonymized.test(line)) {
        parsedBlock.pixelsAnonymized = true;
        return true;
      }
      if (regexes.headersAnonymized.test(line)) {
        parsedBlock.headersAnonymized = true;
        return true;
      }
      if (regexes.elapsedTime.test(line)) {
        [, parsedBlock.elapsedTime] = regexes.elapsedTime.exec(line);
        return true;
      }
      return true;
    });
    // add elapsed time to result object, don't append this block to the files array
    // since it's not referring to a file
    if (parsedBlock.elapsedTime) {
      result.elapsedTime = parsedBlock.elapsedTime;
    } else {
      result.files.push(parsedBlock);
    }
    return true;
  });
  return result;
};
