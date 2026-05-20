import { Document, Paragraph, TextRun, HeadingLevel, Packer } from 'docx';

/**
 * Copies text to the clipboard.
 * @param {string} text
 * @returns {Promise<void>}
 */
export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}

/**
 * Triggers a browser download of a plain-text file.
 * @param {string} studentName
 * @param {string} goalName
 * @param {string} text
 * @param {string} reportingPeriod
 */
export function exportAsTxt(studentName, goalName, text, reportingPeriod = '') {
  const header = [
    `Student: ${studentName}`,
    `Goal: ${goalName}`,
    reportingPeriod ? `Reporting Period: ${reportingPeriod}` : '',
    '',
    '',
  ]
    .filter(Boolean)
    .join('\n');

  const content = header + text;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${studentName}_${goalName}_report.txt`.replace(/\s+/g, '_');
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Generates and downloads a DOCX file containing the narrative.
 * @param {string} studentName
 * @param {string} goalName
 * @param {string} text
 * @param {string} reportingPeriod
 */
export async function exportAsDocx(studentName, goalName, text, reportingPeriod = '') {
  const children = [
    new Paragraph({
      text: `${studentName} — ${goalName}`,
      heading: HeadingLevel.HEADING_1,
    }),
  ];

  if (reportingPeriod) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Reporting Period: ', bold: true }),
          new TextRun(reportingPeriod),
        ],
      })
    );
  }

  children.push(new Paragraph({ text: '' }));
  children.push(
    new Paragraph({
      children: [new TextRun(text)],
    })
  );

  const doc = new Document({
    sections: [{ children }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${studentName}_${goalName}_report.docx`.replace(/\s+/g, '_');
  a.click();
  URL.revokeObjectURL(url);
}
