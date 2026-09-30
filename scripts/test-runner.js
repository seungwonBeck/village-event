const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let failed = false;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failed = true;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

console.log("\n=========================================");
console.log("  못말리는 령고을 시스템 자동 검증 테스트");
console.log("=========================================\n");

// 1. 캐릭터 누끼 이미지 존재 여부 검사
const characters = ['shinchan.png', 'maenggu.png', 'yuri.png', 'himawari.png', 'cheolsu.png', 'hooni.png'];
characters.forEach(char => {
  const p = path.join(__dirname, '..', 'public', 'characters', char);
  assert(fs.existsSync(p), `캐릭터 누끼 이미지 생성 확인: ${char}`);
});

// 2. 주요 데이터 및 컴포넌트 파일 존재 검사
const files = [
  'src/data/event.ts',
  'src/data/schedule.ts',
  'src/data/groups.ts',
  'src/data/recreation.ts',
  'src/data/worship.ts',
  'src/data/prayer.ts',
  'src/data/quiz.ts',
  'src/app/presentation/page.tsx',
  'src/app/join/page.tsx',
  'src/app/live/page.tsx',
  'src/app/admin/page.tsx',
  'src/app/admin/content/page.tsx',
  'src/app/page.tsx'
];

files.forEach(f => {
  const p = path.join(__dirname, '..', f);
  assert(fs.existsSync(p), `필수 소스 파일 확인: ${f}`);
});

// 3. AGENTS.md 규칙 검증: 인라인 스타일(style={...}) 사용 여부 전수 검사
console.log("\n--- AGENTS.md 코딩 표준 검사 (인라인 스타일 금지 규칙) ---");
function checkNoInlineStyles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next') {
        checkNoInlineStyles(fullPath);
      }
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const hasInlineStyle = /style\s*=\s*\{/.test(content);
      assert(!hasInlineStyle, `인라인 스타일 미사용 준수: ${path.relative(__dirname + '/..', fullPath)}`);
    }
  }
}
checkNoInlineStyles(path.join(__dirname, '..', 'src'));

// 4. TypeScript 타입 검사 (tsc --noEmit)
console.log("\n--- TypeScript 엄격 타입 컴파일 검증 ---");
try {
  const localTsc = path.join(__dirname, '..', 'node_modules', 'typescript', 'bin', 'tsc');
  if (fs.existsSync(localTsc)) {
    execSync(`"${process.execPath}" "${localTsc}" --noEmit`, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  } else {
    const npxPath = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    execSync(`${npxPath} tsc --noEmit`, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  }
  console.log("✅ PASS: TypeScript 컴파일 검사 통과 (오류 없음)");
} catch (e) {
  console.error("❌ FAIL: TypeScript 컴파일 오류 발생");
  failed = true;
}

console.log("\n=========================================");
if (failed) {
  console.error("💥 일부 테스트 항목이 실패하였습니다.");
  process.exit(1);
} else {
  console.log("🎉 모든 테스트가 완벽하게 통과되었습니다!");
  process.exit(0);
}
