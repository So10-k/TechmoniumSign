const fs = require('node:fs');
const path = require('node:path');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const { PAGE_HEIGHT, PAGE_WIDTH, templates } = require('../apps/OpenSignServer/data/globalTemplates.cjs');

const outputDir = path.resolve(process.argv[2] || 'apps/OpenSign/public/templates');

function wrap(font, text, size, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) line = candidate;
    else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function renderTemplate(template) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const ink = rgb(0.075, 0.09, 0.12);
  const muted = rgb(0.36, 0.39, 0.43);
  const line = rgb(0.83, 0.84, 0.86);
  const accent = rgb(0.20, 0.31, 0.48);

  page.drawText('TECHMONIUM SIGN', { x: 54, y: 752, size: 8, font: bold, color: accent });
  page.drawText(template.name.replace('Global · ', ''), { x: 54, y: 711, size: 24, font: bold, color: ink });
  page.drawText(template.description, { x: 54, y: 688, size: 9, font: regular, color: muted });
  page.drawLine({ start: { x: 54, y: 672 }, end: { x: 558, y: 672 }, thickness: 1, color: line });

  for (const field of template.fields) {
    const x = field.x;
    const y = PAGE_HEIGHT - field.y;
    page.drawText(field.name.toUpperCase(), { x, y: y + 5, size: 6.5, font: bold, color: muted });
    page.drawRectangle({ x, y: y - field.height + 1, width: field.width, height: field.height, borderWidth: 0.8, borderColor: line, color: rgb(0.98, 0.98, 0.975) });
  }

  let cursorY = template.fields.length > 4 ? 533 : 573;
  for (const [heading, body] of template.sections) {
    page.drawText(heading, { x: 54, y: cursorY, size: 8.5, font: bold, color: ink });
    const lines = wrap(regular, body, 7.7, 425);
    let bodyY = cursorY;
    for (const text of lines) {
      page.drawText(text, { x: 133, y: bodyY, size: 7.7, font: regular, color: ink });
      bodyY -= 10;
    }
    cursorY = Math.min(cursorY - 28, bodyY - 10);
  }

  page.drawLine({ start: { x: 54, y: 157 }, end: { x: 558, y: 157 }, thickness: 1, color: line });
  page.drawText('SIGNATURES', { x: 54, y: 139, size: 7, font: bold, color: accent });
  template.roles.forEach((signer) => {
    const x = signer.widgets[0].x;
    page.drawText(signer.name.toUpperCase(), { x, y: 118, size: 6.5, font: bold, color: muted });
    page.drawLine({ start: { x, y: 80 }, end: { x: x + 180, y: 80 }, thickness: 0.8, color: ink });
    page.drawText('Signature', { x, y: 67, size: 6.5, font: regular, color: muted });
    page.drawLine({ start: { x, y: 43 }, end: { x: x + 125, y: 43 }, thickness: 0.8, color: ink });
    page.drawText('Date', { x, y: 30, size: 6.5, font: regular, color: muted });
  });

  page.drawText('General template only. Review the completed agreement with qualified counsel before use.', { x: 54, y: 12, size: 6.25, font: regular, color: muted });
  pdf.setTitle(template.name.replace('Global · ', ''));
  pdf.setAuthor('Techmonium Sign');
  pdf.setSubject(template.description);
  return pdf.save();
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  for (const template of templates) {
    const bytes = await renderTemplate(template);
    fs.writeFileSync(path.join(outputDir, `${template.slug}.pdf`), bytes);
  }
  process.stdout.write(`generated=${templates.length}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
