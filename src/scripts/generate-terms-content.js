const fs = require("fs");
const path = require("path");

// HTML 파일들이 있는 디렉토리
const assignmentDir = path.join(__dirname, "../../public/assets/assignment");

// HTML 파일 목록
const htmlFiles = [
  "동네방네_서비스_통합_정책_가이드라인_V1.html",
  "개인정보_처리방침_소비자_V2.html",
  "동네방네_가맹점_개인정보_처리방침_V2.html",
  "동네방네_마케팅_수신_동의_약관_V1.html",
];

// HTML 내용을 읽어서 JavaScript 파일로 변환
let jsContent = `// 이 파일은 자동 생성됩니다. 직접 수정하지 마세요.
// HTML 약관 파일들의 내용을 포함합니다.
// 업데이트하려면: npm run generate-terms 또는 node src/scripts/generate-terms-content.js

export const TERMS_HTML = {
`;

htmlFiles.forEach((filename) => {
  const filePath = path.join(assignmentDir, filename);
  try {
    const htmlContent = fs.readFileSync(filePath, "utf-8");
    // HTML 내용을 이스케이프하여 JavaScript 문자열로 변환
    const escapedContent = JSON.stringify(htmlContent);
    jsContent += `  "${filename}": ${escapedContent},\n`;
    console.log(`✓ ${filename} 처리 완료`);
  } catch (error) {
    console.error(`✗ ${filename} 읽기 실패:`, error.message);
  }
});

jsContent += `};
`;

// JavaScript 파일 저장 (src/utils 폴더에 저장)
const outputPath = path.join(__dirname, "../utils/termsContent.js");
fs.writeFileSync(outputPath, jsContent, "utf-8");
console.log(`\n✓ ${outputPath} 생성 완료`);
