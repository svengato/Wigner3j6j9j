// =============================================================================
// wigner-3j.js
// =============================================================================

function wigner3j(sj1, sj2, sj3, sm1, sm2, sm3) {
  let j1 = parseFloat(sj1);
  let j2 = parseFloat(sj2);
  let j3 = parseFloat(sj3);
  let m1 = parseFloat(sm1);
  let m2 = parseFloat(sm2);
  let m3 = parseFloat(sm3);

  // Check rules:
  //   ji > 0 (true by definition, no need to test)
  //   abs(mi) <= ji
  //   ji + mi = integer
  //   triangle relation: j1 + j2 + j3 = integer and ∆(j1, j2, j3)
  //   m1 + m2 + m3 = 0 (true since we set m3 = -(m1 + m2))
  //   j1 + j2 + j3 <= jmax (no longer relevant thanks to BigInt)
  if (Math.abs(m1) > j1) {
    throw new Error("abs(m1) > j1");
  } else if (Math.abs(m2) > j2) {
    throw new Error("abs(m2) > j2");
  } else if (Math.abs(m3) > j3) {
    throw new Error("abs(m3) > j3");
  } else if (!isInteger(j1 + m1)) {
    throw new Error("j1 and m1 must both be integer or half-integer");
  } else if (!isInteger(j2 + m2)) {
    throw new Error("j2 and m2 must both be integer or half-integer");
  } else if (!isInteger(j3 + m3)) {
    throw new Error("j3 and m3 must both be integer or half-integer");
  } else if (!isInteger(j1 + j2 + j3)) {
    throw new Error("j1 + j2 + j3 must be an integer");
  } else if (!triangle(j1, j2, j3)) {
    throw new Error("(j1, j2, j3) triangle relation is not satisfied");
  }

  // Calculate the result (all quantities are BigInt)
  let q1 = BigInt(j1 - m1);
  let q2 = BigInt(j2 + m2);
  let q3 = BigInt(j1 + j2 - j3);
  let q4 = BigInt(j3 + j1 - j2);
  let q5 = BigInt(j2 + j3 - j1);
  let kmax = (q1 < q2 ? q1 : q2);
  kmax = (q3 < kmax ? q3 : kmax);
  let q6 = q1 - q4; // = j2 - j3 - m1
  let q7 = q2 - q5; // = j1 - j3 + m2
  let kmin = (q6 > q7 ? q6 : q7);
  kmin = (0n > kmin ? 0n : kmin);

  let sum = 0n;
  for (let k = kmin; k <= kmax; k++) {
    let z = chooseZ(q3, k)*chooseZ(q4, q1 - k)*chooseZ(q5, q2 - k);
    let sign_k = (k % 2n == 0n ? 1n : -1n);
    sum += sign_k*z;
  }

  let sign_sum = (sum >= 0n ? 1n : -1n);
  let z2 = sign_sum*sum*sum; // put in rational sqrt form, but retain its sign
  let q8 = BigInt(j1 + m1);
  let q9 = BigInt(j2 - m2);
  let q10 = BigInt(j3 + m3);
  let q11 = BigInt(j3 - m3);
  z2 = z2*factorialZ(q8)*factorialZ(q1)*factorialZ(q2)*factorialZ(q9);
  z2 = z2*factorialZ(q10)*factorialZ(q11);
  let sign89 = ((q8 - q9) % 2n == 0n ? 1n : -1n);
  z2 = sign89*z2;

  // denominator
  let q12 = BigInt(j1 + j2 + j3 + 1);
  let z2d = factorialZ(q3)*factorialZ(q4)*factorialZ(q5)*factorialZ(q12);

  let pft = new PrimeFactorTable(z2);
  let pftd = new PrimeFactorTable(z2d);
  pft.divideBy(pftd);
  return pft;
}

// =============================================================================
