const express = require('express');
const router = express.Router();
const GuidePreference = require('../models/GuidePreference');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, VerticalAlign, BorderStyle } = require('docx');
const fs = require('fs');
const path = require('path');

// POST: Add new guide preference
router.post('/preference', async (req, res, next) => {
  try {
    const data = req.body;
    if (!Array.isArray(data)) {
      return res.status(400).json({ error: 'Expected an array of preferences' });
    }

    await GuidePreference.insertMany(data);
    res.status(201).json({ message: 'Preferences added successfully' });
  } catch (err) {
    next(err);
  }
});


// GET: All or by year
router.get('/preference', async (req, res, next) => {
  const { year } = req.query;
  const filter = year ? { academicYear: year } : {};
  const preferences = await GuidePreference.find(filter).sort({ guideName: 1 });
  res.json(preferences);
});

// GET: Specific year by param
router.get('/preference/view/:year', async (req, res, next) => {
  const year = req.params.year;
  const preferences = await GuidePreference.find({ academicYear: year });
  res.json(preferences);
});

// GET: Download as Word
router.get('/preference/download', async (req, res) => {
  try {
    const { year } = req.query;
    console.log("Year received:", year);

    const normalizedYear = year.trim(); // clean any white space
    const preferences = await GuidePreference.find({ academicYear: normalizedYear });
    console.log("Fetched preferences:", preferences);

    // Group by domain
    const grouped = {};
    preferences.forEach(p => {
      if (!grouped[p.domain]) grouped[p.domain] = [];
      grouped[p.domain].push(p.subDomain);
    });

    // Table header
    const tableRows = [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Sr.No", bold: true })] })],
            width: { size: 10, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Area/Domain", bold: true })] })],
            width: { size: 30, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Sub-Domain", bold: true })] })],
            width: { size: 60, type: WidthType.PERCENTAGE },
          }),
        ],
      })
    ];

    let index = 1;

    for (const [domain, subDomains] of Object.entries(grouped)) {
      const subRows = [];

      subDomains.forEach((subDomain, idx) => {
        const rowCells = [];

        if (idx === 0) {
          // First row: Sr.No, Domain, Sub-domain
          rowCells.push(
            new TableCell({
              children: [new Paragraph(String(index))],
              rowSpan: subDomains.length,
              verticalAlign: VerticalAlign.CENTER,
            }),
            new TableCell({
              children: [new Paragraph(domain)],
              rowSpan: subDomains.length,
              verticalAlign: VerticalAlign.CENTER,
            }),
            new TableCell({
              children: [new Paragraph(subDomain)],
            })
          );
        } else {
          // Remaining rows: only Sub-domain
          rowCells.push(
            new TableCell({
              children: [new Paragraph(subDomain)],
            })
          );
        }

        subRows.push(new TableRow({ children: rowCells }));
      });

      tableRows.push(...subRows);
      index++;
    }

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: "TY.B.Tech (CSE) - Div A, B and C",
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: `AY: ${year}`,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: "Area/Domain and Sub Domain for Mini Project Allocation",
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: tableRows,
          }),
        ],
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    res.setHeader("Content-Disposition", "attachment; filename=Guide_Preferences.docx");
    res.send(buffer);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating document');
  }
});



module.exports = router;
