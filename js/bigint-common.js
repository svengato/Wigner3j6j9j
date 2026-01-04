// =============================================================================
// bigint-common.js
// =============================================================================

// BigInt functions: arguments and return type are BigInt

// factorial
function factorialZ(n) {
  if (n == 0n || n == 1n) return 1n;
  return n*factorialZ(n - 1n);
}

/*
Test:
factorialZ(42n);
1405006117752879898543142606244511569936384000000000n
*/

// binomial coefficient
function chooseZ(n, k) {
  return factorialZ(n)/(factorialZ(k)*factorialZ(n - k));
}

/*
Test:
chooseZ(100n, 25n);
242519269720337121015504n
*/

// square root
// TODO: do it straightforwardly up to a threshold
// TODO: exit gracefully if n is not a square
  // for example if n = 24 it will go 4-5-4-5-...
function sqrtZ(n) {
  // initial guess
  let x = Math.floor(Math.sqrt(parseFloat(n)));
  let m = BigInt(x);

  // Newton's method
  let m0 = 0n;
  while (m != m0) {
    m0 = m;
    m = (m + n/m)/2n
  }

  if (m*m != n) throw new Error("sqrtZ() did not converge");
  return m;
}

function sqrtZb(n) {
  // initial guess
  let x = Math.floor(Math.sqrt(parseFloat(n)));
  let m = BigInt(x);
  let m2 = m*m;

  // bracketing guesses for binary search
  let ml = m;
  let mr = m;
  if (m2 < n) {
    let xr = Math.floor(Math.sqrt(parseFloat(n*2n)));
    mr = BigInt(xr);
  } else if (m2 > n) {
    let xl = Math.floor(Math.sqrt(parseFloat(n/2n)));
    ml = BigInt(xl);
  }

  // binary search
  while (m2 != n) {
    m = (ml + mr)/2n;
    m2 = m*m;
    if (m2 < n) {
      ml = m;
    } else {
      mr = m;
    }
  }

  return m;
}

// =============================================================================
