import { Parser } from "json2csv";
import fs from "fs";

export function generateCSV(data, filePath) {
  try {
    const parser = new Parser();
    const csv = parser.parse(data);
    fs.writeFileSync(filePath, csv);
    console.log(`✅ CSV saved at ${filePath}`);
  } catch (err) {
    console.error("❌ CSV generation failed:", err);
  }
}
