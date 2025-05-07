interface Position {
  left: number;
  top: number;
}

interface GridPosition {
  x: number;
  y: number;
}

const randomPosition = (max: number, size: number): number => {
  return Math.random() * (max - size);
};

export const generateBreadPositions = (
  count: number,
  containerWidth: number,
  containerHeight: number,
  imgSize: number,
  minSpacing: number,
  padding: number
): Position[] => {
  const positions: Position[] = [];
  const gridSize = imgSize + minSpacing;
  const maxX = Math.floor((containerWidth - padding * 2) / gridSize);
  const maxY = Math.floor((containerHeight - padding * 2) / gridSize);
  const totalCells = maxX * maxY;

  // 가능한 모든 위치를 그리드로 생성
  const availablePositions: GridPosition[] = [];
  for (let x = 0; x < maxX; x++) {
    for (let y = 0; y < maxY; y++) {
      availablePositions.push({ x, y });
    }
  }

  // 위치를 무작위로 섞기
  for (let i = availablePositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availablePositions[i], availablePositions[j]] = [availablePositions[j], availablePositions[i]];
  }

  // 필요한 만큼의 위치 선택
  for (let i = 0; i < Math.min(count, totalCells); i++) {
    const { x, y } = availablePositions[i];
    const left = padding + x * gridSize + (Math.random() * (gridSize - imgSize));
    const top = padding + y * gridSize + (Math.random() * (gridSize - imgSize));
    positions.push({ left, top });
  }

  // 추가 위치가 필요한 경우 (그리드보다 많은 빵이 필요한 경우)
  if (count > totalCells) {
    for (let i = totalCells; i < count; i++) {
      let left: number, top: number;
      let attempts = 0;
      const maxAttempts = 200;

      do {
        left = randomPosition(containerWidth - imgSize - padding * 2, imgSize) + padding;
        top = randomPosition(containerHeight - imgSize - padding * 2, imgSize) + padding;
        attempts++;

        // 이전 위치들과 겹치는지 확인
        const isOverlapping = positions.some(pos => {
          const dx = Math.abs(pos.left - left);
          const dy = Math.abs(pos.top - top);
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < imgSize + minSpacing;
        });

        if (!isOverlapping || attempts >= maxAttempts) break;
      } while (true);

      positions.push({ left, top });
    }
  }

  return positions;
}; 