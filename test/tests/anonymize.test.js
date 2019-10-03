const dat = require('../..')();
const path = require('path');
const fs = require('fs-extra');

const localOutputDir = path.join(__dirname, '../dicom/output');

beforeAll(() => fs.emptyDir(localOutputDir));

afterAll(() => fs.emptyDir(localOutputDir));

test('check dependencies', (done) => {
  dat.checkDependencies((err, deps) => {
    expect(err).toBeFalsy();
    expect(deps.Java).not.toBeFalsy();
    expect(deps.DicomAnonymizerTool).not.toBeFalsy();
    done();
  });
});

test('successfully anonymize ct', (done) => {
  dat.anonymize(
    {
      args: ['-in', path.join(__dirname, '../dicom/ct'), '-out', localOutputDir],
    },
    (err, output) => {
      const { files } = output.parsed;
      expect(files).toHaveLength(5);
      expect(files.every(f => typeof f.file === 'string' && f.file.length > 0));
      expect(files.every(f => f.headersAnonymized));
      expect(files.every(f => !f.pixelsAnonymized));
      done();
    },
  );
});

test('successfully anonymize cxr', (done) => {
  dat.anonymize(
    {
      args: ['-in', path.join(__dirname, '../dicom/cxr'), '-out', localOutputDir],
    },
    (err, output) => {
      const { files } = output.parsed;
      expect(files).toHaveLength(1);
      expect(files.every(f => typeof f.file === 'string' && f.file.length > 0));
      expect(files.every(f => f.headersAnonymized));
      expect(files.every(f => !f.pixelsAnonymized));
      done();
    },
  );
});

test('successfully anonymize ultrasound', (done) => {
  dat.anonymize(
    {
      args: ['-in', path.join(__dirname, '../dicom/us'), '-out', localOutputDir],
    },
    (err, output) => {
      const { files } = output.parsed;
      expect(files).toHaveLength(1);
      expect(files.every(f => typeof f.file === 'string' && f.file.length > 0));
      expect(files.every(f => f.headersAnonymized));
      expect(files.every(f => f.pixelsAnonymized));
      done();
    },
  );
});

test('successfully skip non-dicom', (done) => {
  dat.anonymize(
    {
      args: ['-in', path.join(__dirname, '../dicom/ct with invalid files'), '-out', localOutputDir],
    },
    (err, output) => {
      const { files } = output.parsed;
      const validFiles = files.filter(f => f.headersAnonymized && !f.skipped);
      const invalidFiles = files.filter(f => !f.headersAnonymized && f.skipped);

      expect(files).toHaveLength(6);
      expect(validFiles).toHaveLength(5);
      expect(invalidFiles).toHaveLength(1);
      done();
    },
  );
});

test('successfully reject filtered dicom', (done) => {
  dat.anonymize(
    {
      args: [
        '-in',
        path.join(__dirname, '../dicom/us'),
        '-f',
        path.join(__dirname, '../dat_scripts/filter_us.script'),
        '-out',
        localOutputDir,
      ],
    },
    (err, output) => {
      const { files } = output.parsed;

      expect(files).toHaveLength(1);
      expect(files[0].skipped).toEqual('non-matching DICOM file');
      expect(files[0].pixelsAnonymized).toEqual(false);
      expect(files[0].headersAnonymized).toEqual(false);
      done();
    },
  );
});

test('handle already anonymized file', (done) => {
  dat.anonymize(
    {
      args: ['-in', path.join(__dirname, '../dicom/anonymized'), '-out', localOutputDir],
    },
    (err, output) => {
      const { files } = output.parsed;

      expect(files).toHaveLength(1);
      expect(files[0].pixelsAnonymized).toEqual(false);
      expect(files[0].headersAnonymized).toEqual(true);
      done();
      done();
    },
  );
});
