export default class EletjatekSzimulator {
  rows: number;
  cols: number;
  matrix: number[][];

  constructor(row: number, col: number) {
    this.rows = row;
    this.cols = col;

    this.matrix = [];

    for (let r = 0; r < row; r++) {
      const currentRow: number[] = [];

      for (let c = 0; c < col; c++) {
        currentRow.push(0);
      }

      this.matrix.push(currentRow);
    }
  }

  getCell(r: number, c: number) {
    return this.matrix[r][c];
  }

  setCell(
    r: number,
    c: number,
    value: number
  ) {
    this.matrix[r][c] = value;
  }

  getRows() {
    return this.matrix;
  }

  countNeighbors(r: number, c: number) {
    let total = 0;
    let p1 = 0;
    let p2 = 0;

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0)
          continue;

        const newR = r + i;
        const newC = c + j;

        if (
          newR >= 0 &&
          newR < this.rows &&
          newC >= 0 &&
          newC < this.cols
        ) {
          const value =
            this.matrix[newR][newC];

          if (value === 1) {
            total++;
            p1++;
          }

          if (value === 2) {
            total++;
            p2++;
          }
        }
      }
    }

    return { total, p1, p2 };
  }

  nextGeneration() {
    const oldMatrix = this.matrix.map((row) =>
    [...row]
    );
    const newMatrix: number[][] = [];

    for (let r = 0; r < this.rows; r++) {
      const row: number[] = [];

      for (let c = 0; c < this.cols; c++) {
        const neighbors =
          this.countNeighbors(r, c);

        const current =
          this.matrix[r][c];

        if (current !== 0) {
          if (
            neighbors.total === 2 ||
            neighbors.total === 3
          ) {
            row.push(current);
          } else {
            row.push(0);
          }
        } else {
          if (neighbors.total === 3) {
            if (
              neighbors.p1 >
              neighbors.p2
            ) {
              row.push(1);
            } else {
              row.push(2);
            }
          } else {
            row.push(0);
          }
        }
      }

      newMatrix.push(row);
    }

    this.matrix = newMatrix;
    return !this.isSameMatrix(oldMatrix);
  }

  countPlayers() {
    let p1 = 0;
    let p2 = 0;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.matrix[r][c] === 1) {
          p1++;
        }

        if (this.matrix[r][c] === 2) {
          p2++;
        }
      }
    }

    return { p1, p2 };
  }
  isSameMatrix(other: number[][]) {
  for (let r = 0; r < this.rows; r++) {
    for (let c = 0; c < this.cols; c++) {
      if (
        this.matrix[r][c] !==
        other[r][c]
      ) {
        return false;
      }
    }
  }

  return true;
}
}