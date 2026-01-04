// =============================================================================
// wigner-9j.js
// =============================================================================

function primeFactorTableSum(pfts) {
  let pft = new PrimeFactorTable(0n);
  let rs = new RationalSqrt(pft);
  rs.integerizeNumerator(); // not necessary?

  // loop over all combinations in pfts, match like terms
  for (pfti of pfts) {
    if (pfti.equalsZero()) continue;

    let rsi = new RationalSqrt(pfti);
    rsi.integerizeNumerator();

    // having converted the numerator to an integer, we can sum the terms
    if (pft.equalsZero()) {
      pft = pfti;
      rs = new RationalSqrt(pft);
      rs.integerizeNumerator();
    } else {
      // subsequent terms
      let n = rs.n1*rsi.d1 + rsi.n1*rs.d1;
      pft = new PrimeFactorTable(n);
      pft.divideBy(new PrimeFactorTable(rs.d1*rsi.d1));
      pft.square();
      if (n < 0n) ++pft.primeFactors[1];
      pft.divideBy(new PrimeFactorTable(rsi.d2)); // knowing that rsi.d2 == rs.d2 after integerizing the numerators
      rs = new RationalSqrt(pft);
      rs.integerizeNumerator();
    }
  }

  return pft;
}

function wigner9j(sj1, sj2, sj3, sj4, sj5, sj6, sj7, sj8, sj9) {
  let j1 = parseFloat(sj1);
  let j2 = parseFloat(sj2);
  let j3 = parseFloat(sj3);
  let j4 = parseFloat(sj4);
  let j5 = parseFloat(sj5);
  let j6 = parseFloat(sj6);
  let j7 = parseFloat(sj7);
  let j8 = parseFloat(sj8);
  let j9 = parseFloat(sj9);

  // Check rules:
  //   ji > 0 (true by definition, no need to test)
  //   triangle relations:
  //     j1 + j2 + j3 = integer and ∆(j1, j2, j3)
  //     j4 + j5 + j6 = integer and ∆(j4, j5, j6)
  //     j7 + j8 + j9 = integer and ∆(j7, j8, j9)
  //     j1 + j4 + j7 = integer and ∆(j1, j4, j7)
  //     j2 + j5 + j8 = integer and ∆(j2, j5, j8)
  //     j3 + j6 + j9 = integer and ∆(j3, j6, j9)
  //   j1 + j2 + j3 <= jmax (no longer relevant thanks to BigInt)
  if (!isInteger(j1 + j2 + j3)) {
    throw new Error("j1 + j2 + j3 must be an integer");
  } else if (!isInteger(j4 + j5 + j6)) {
    throw new Error("j4 + j5 + j6 must be an integer");
  } else if (!isInteger(j7 + j8 + j9)) {
    throw new Error("j7 + j8 + j9 must be an integer");
  } else if (!isInteger(j1 + j4 + j7)) {
    throw new Error("j1 + j4 + j7 must be an integer");
  } else if (!isInteger(j2 + j5 + j8)) {
    throw new Error("j2 + j5 + j8 must be an integer");
  } else if (!isInteger(j3 + j6 + j9)) {
    throw new Error("j3 + j6 + j9 must be an integer");
  } else if (!triangle(j1, j2, j3)) {
    throw new Error("(j1, j2, j3) triangle relation is not satisfied");
  } else if (!triangle(j4, j5, j6)) {
    throw new Error("(j4, j5, j6) triangle relation is not satisfied");
  } else if (!triangle(j7, j8, j9)) {
    throw new Error("(j7, j8, j9) triangle relation is not satisfied");
  } else if (!triangle(j1, j4, j7)) {
    throw new Error("(j1, j4, j7) triangle relation is not satisfied");
  } else if (!triangle(j2, j5, j8)) {
    throw new Error("(j2, j5, j8) triangle relation is not satisfied");
  } else if (!triangle(j3, j6, j9)) {
    throw new Error("(j3, j6, j9) triangle relation is not satisfied");
  }

  // Calculate the result (all quantities are BigInt)
  let nmin = (j4 > j8 ? BigInt(2*(j4 - j8)) : BigInt(2*(j8 - j4)));
  let q19 = (j1 > j9 ? BigInt(2*(j1 - j9)) : BigInt(2*(j9 - j1)));
  if (q19 > nmin) nmin = q19;
  let q26 = (j2 > j6 ? BigInt(2*(j2 - j6)) : BigInt(2*(j6 - j2)));
  if (q26 > nmin) nmin = q26;
  let nmax = BigInt(2*(j4 + j8));
  q19 = BigInt(2*(j1 + j9));
  if (q19 < nmax) nmax = q19;
  q26 = BigInt(2*(j2 + j6));
  if (q26 < nmax) nmax = q26;

  let pfts = [];
  for (let n = nmin; n <= nmax; n += 2n) {
    // n is the numerator of k (k = n/2)
    let k = parseFloat(n)/2;
    let pftk = wigner6j(j1, j4, j7, j8, j9, k, bIntermediate = true);
    pftk.multiply(wigner6j(j2, j5, j8, j4, k, j6, bIntermediate = true));
    pftk.multiply(wigner6j(j3, j6, j9, k, j1, j2, bIntermediate = true));
    let signk = (n % 2n == 0n ? 1n : -1n); // really sign of 2k = n
    if (signk == -1n) ++pftk.primeFactors[1];
    let pftn1 = new PrimeFactorTable(n + 1n);
    pftn1.square();
    pftk.multiply(pftn1);
    pfts.push(pftk);
  }

  let pft = primeFactorTableSum(pfts);
  return pft;
}

// =============================================================================
