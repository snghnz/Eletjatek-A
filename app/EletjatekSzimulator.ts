
export default class EletjatekSzimulator {
    rows: number;
    cols: number;
    matrix: number[][];
  constructor(row: number, col: number) {
    this.rows = row;
    this.cols = col;

    this.matrix = [];

    for (let r = 0; r < row; r++) {
      const row = [];

      for (let c = 0; c < col; c++) {
        row.push(0);
      }

      this.matrix.push(row);
    }
  }

  getCell(r: number, c: number) {
    return this.matrix[r][c];
  }

  setCell(r: number, c: number, value: number) {
    this.matrix[r][c] = value;
  }

  getRows() {
    return this.matrix;
  }
}