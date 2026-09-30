const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 캐릭터 디렉토리와 출력 디렉토리
const characterDir = path.join(__dirname, '..', '캐릭터');
const outputDir = path.join(__dirname, '..', 'public', 'characters');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 픽셀이 흰색/배경색인지 확인하는 함수
function isWhiteBackground(r, g, b) {
  // 흰색 및 미세한 오프화이트 포함 (밝기 240 이상)
  return r >= 240 && g >= 240 && b >= 240;
}

// 외곽에서 시작하는 Flood Fill을 통한 배경 투명화
async function removeFloodFillBackground(inputPath, outputPath) {
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const { width, height } = metadata;

  // RGBA raw 버퍼 추출
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const visited = new Uint8Array(width * height);
  const queue = [];

  // 가장자리 픽셀들을 큐에 삽입
  for (let x = 0; x < width; x++) {
    // 위쪽 가장자리
    const idxTop = (0 * width + x) * 4;
    if (isWhiteBackground(data[idxTop], data[idxTop + 1], data[idxTop + 2])) {
      queue.push(0 * width + x);
      visited[0 * width + x] = 1;
    }
    // 아래쪽 가장자리
    const idxBottom = ((height - 1) * width + x) * 4;
    if (isWhiteBackground(data[idxBottom], data[idxBottom + 1], data[idxBottom + 2])) {
      queue.push((height - 1) * width + x);
      visited[(height - 1) * width + x] = 1;
    }
  }

  for (let y = 0; y < height; y++) {
    // 왼쪽 가장자리
    const idxLeft = (y * width + 0) * 4;
    if (isWhiteBackground(data[idxLeft], data[idxLeft + 1], data[idxLeft + 2])) {
      if (!visited[y * width + 0]) {
        queue.push(y * width + 0);
        visited[y * width + 0] = 1;
      }
    }
    // 오른쪽 가장자리
    const idxRight = (y * width + (width - 1)) * 4;
    if (isWhiteBackground(data[idxRight], data[idxRight + 1], data[idxRight + 2])) {
      if (!visited[y * width + (width - 1)]) {
        queue.push(y * width + (width - 1));
        visited[y * width + (width - 1)] = 1;
      }
    }
  }

  // BFS 탐색으로 연결된 배경 픽셀만 알파 0으로 변환
  let head = 0;
  const neighbors = [-1, 1, -width, width];

  while (head < queue.length) {
    const current = queue[head++];
    const cx = current % width;
    const cy = Math.floor(current / width);

    // 알파값을 0으로 설정
    const pixelIdx = current * 4;
    data[pixelIdx + 3] = 0;

    // 4방향 이웃 탐색
    if (cx > 0) checkNeighbor(current - 1);
    if (cx < width - 1) checkNeighbor(current + 1);
    if (cy > 0) checkNeighbor(current - width);
    if (cy < height - 1) checkNeighbor(current + width);
  }

  function checkNeighbor(nIdx) {
    if (visited[nIdx]) return;
    const pIdx = nIdx * 4;
    if (isWhiteBackground(data[pIdx], data[pIdx + 1], data[pIdx + 2])) {
      visited[nIdx] = 1;
      queue.push(nIdx);
    }
  }

  // 경계선 소프트 블렌딩 (가장자리 아티팩트 제거)
  await sharp(data, {
    raw: {
      width,
      height,
      channels: 4,
    },
  })
    .png()
    .toFile(outputPath);
}

async function processAll() {
  const files = [
    { input: '짱구.webp', output: 'shinchan.png' },
    { input: '맹구.webp', output: 'maenggu.png' },
    { input: '유리.webp', output: 'yuri.png' },
    { input: '짱아.webp', output: 'himawari.png' },
    { input: '철수.webp', output: 'cheolsu.png' },
  ];

  for (const item of files) {
    const src = path.join(characterDir, item.input);
    const dest = path.join(outputDir, item.output);
    await removeFloodFillBackground(src, dest);
  }
}

processAll();
