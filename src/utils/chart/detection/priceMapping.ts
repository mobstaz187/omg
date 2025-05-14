export interface PricePoint {
  red: number;
  green: number;
  price: number;
  wickLength: number;
}

export function mapPriceLevels(
  width: number,
  height: number,
  colorCounts: any[][]
): PricePoint[] {
  const points: PricePoint[] = [];
  const threshold = Math.floor(width * 0.02);

  for (let y = 0; y < height; y++) {
    let redTotal = 0;
    let greenTotal = 0;
    let wickLength = 0;

    for (let x = 0; x < width; x++) {
      const counts = colorCounts[y][x];
      redTotal += counts.red;
      greenTotal += counts.green;
      if (counts.wick) {
        wickLength++;
      }
    }

    if (redTotal > threshold || greenTotal > threshold) {
      points.push({
        price: convertYToPrice(y, height),
        red: redTotal,
        green: greenTotal,
        wickLength
      });
    }
  }

  return points;
}

function convertYToPrice(y: number, height: number): number {
  return Math.round((height - y) * 100 / height);
}