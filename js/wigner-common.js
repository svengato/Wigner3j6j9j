// =============================================================================
// wigner-common.js
// Common functions used by Wigner 3j/6j/9j symbol calculators
// =============================================================================

function isInteger(jsum) {
  return (Math.round(jsum) == jsum);
}

function triangle(j1, j2, j3) {
  return (Math.abs(j1 - j2) <= j3) && (j3 <= j1 + j2);
}

// =============================================================================
