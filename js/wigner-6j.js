// =============================================================================
// wigner-6j.js
// =============================================================================

function wigner6j(sj1, sj2, sj3, sj4, sj5, sj6, bIntermediate = false) {
  let j1 = parseFloat(sj1);
  let j2 = parseFloat(sj2);
  let j3 = parseFloat(sj3);
  let j4 = parseFloat(sj4);
  let j5 = parseFloat(sj5);
  let j6 = parseFloat(sj6);

  // zero result for intermediate calculations (in 9j symbols, for example)
  let pft0 = new PrimeFactorTable(0n);

  // Check rules:
  //   ji, li > 0 (true by definition, no need to test)
  //   triangle relations:
  //     j1 + j2 + j3 = integer and ∆(j1, j2, j3)
  //     j1 + j5 + j6 = integer and ∆(j1, j5, j6)
  //     j2 + j4 + j6 = integer and ∆(j2, j4, j6)
  //     j3 + j4 + j5 = integer and ∆(j3, j4, j5)
  //   j1 + j2 + j3 <= jmax (no longer relevant thanks to BigInt)
  if (!isInteger(j1 + j2 + j3)) {
    if (bIntermediate) {
      return pft0;
    } else {
      throw new Error("j1 + j2 + j3 is not an integer");
    }
  } else if (!isInteger(j1 + j5 + j6)) {
    if (bIntermediate) {
      return pft0;
    } else {
      throw new Error("j1 + j5 + j6 is not an integer");
    }
  } else if (!isInteger(j2 + j4 + j6)) {
    if (bIntermediate) {
      return pft0;
    } else {
      throw new Error("j2 + j4 + j6 is not an integer");
    }
  } else if (!isInteger(j3 + j4 + j5)) {
    if (bIntermediate) {
      return pft0;
    } else {
      throw new Error("j3 + j4 + j5 is not an integer");
    }
  } else if (!triangle(j1, j2, j3)) {
    if (bIntermediate) {
      return pft0;
    } else {
      throw new Error("(j1, j2, j3) triangle relation is not satisfied");
    }
  } else if (!triangle(j1, j5, j6)) {
    if (bIntermediate) {
      return pft0;
    } else {
      throw new Error("(j1, j5, j6) triangle relation is not satisfied");
    }
  } else if (!triangle(j2, j4, j6)) {
    if (bIntermediate) {
      return pft0;
    } else {
      throw new Error("(j2, j4, j6) triangle relation is not satisfied");
    }
  } else if (!triangle(j3, j4, j5)) {
    if (bIntermediate) {
      return pft0;
    } else {
      throw new Error("(j3, j4, j5) triangle relation is not satisfied");
    }
  }

  // Calculate the result (all quantities are BigInt)
  let q1 = BigInt(j1 + j2 - j3);
  let q2 = BigInt(j4 + j5 - j3);
  let q3 = BigInt(j4 + j2 - j6);
  let q4 = BigInt(j1 + j5 - j6);
  let kmax = (q1 < q2 ? q1 : q2);
  kmax = (q3 < kmax ? q3 : kmax);
  kmax = (q4 < kmax ? q4 : kmax);
  let q5 = BigInt(j1 + j4 - j3 - j6);
  let q6 = BigInt(j2 + j5 - j3 - j6);
  let kmin = (q5 > q6 ? q5 : q6);
  kmin = (0n > kmin ? 0n : kmin);
  let q7 = BigInt(j1 + j2 + j4 + j5);
  let q8 = BigInt(j1 + j2 + j3 + 1);

  let sum = 0n;
  for (let k = kmin; k <= kmax; k++) {
    let z = chooseZ(q1, k)*chooseZ(q7 + 1n - k, q8)*chooseZ(q3 - q5, q3 - k)*chooseZ(q4 - q6, q4 - k);
    let sign_k = (k % 2n == 0n ? 1n : -1n);
    sum += sign_k*z;
  }

  let sign_sum = (sum >= 0n ? 1n : -1n);
  let z2 = sign_sum*sum*sum; // put in rational sqrt form, but retain its sign
  z2 = z2*factorialZ(q8)*factorialZ(q2)*factorialZ(q3)*factorialZ(q4);

  let q9 = BigInt(j4 - j5 + j3);
  let q10 = BigInt(j5 - j4 + j3);
  z2 = z2*factorialZ(q9)*factorialZ(q10);
  let q11 = BigInt(j1 - j5 + j6);
  let q12 = BigInt(j5 - j1 + j6);
  z2 = z2*factorialZ(q11)*factorialZ(q12);
  let q13 = BigInt(j4 - j2 + j6);
  let q14 = BigInt(j2 - j4 + j6);
  z2 = z2*factorialZ(q13)*factorialZ(q14);
  let sign7 = (q7 % 2n == 0n ? 1n : -1n);
  z2 = sign7*z2;

  // denominator
  let q15 = BigInt(j3 + j2 - j1);
  let q16 = BigInt(j3 + j1 - j2);
  let q17 = BigInt(j3 + j4 + j5 + 1);
  let q18 = BigInt(j2 + j4 + j6 + 1);
  let q19 = BigInt(j1 + j5 + j6 + 1);
  let z2d = factorialZ(q1)*factorialZ(q15)*factorialZ(q16)*factorialZ(q17)*factorialZ(q18)*factorialZ(q19);

  let pft = new PrimeFactorTable(z2);
  let pftd = new PrimeFactorTable(z2d);
  pft.divideBy(pftd);
  return pft;
}

// =============================================================================
