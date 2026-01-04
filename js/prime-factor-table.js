// =============================================================================
// prime-factor-table.js
// =============================================================================

class PrimeFactorTable {
  static primes = [ 0n, -1n, 2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n,
    37n, 41n, 43n, 47n, 53n, 59n, 61n, 67n, 71n, 73n, 79n, 83n, 89n, 97n, 101n,
    103n, 107n, 109n, 113n, 127n, 131n, 137n, 139n, 149n, 151n, 157n, 163n, 167n,
    173n, 179n, 181n, 191n, 193n, 197n, 199n ];
  static numPrimes = PrimeFactorTable.primes.length;

  // TODO: no need for power argument, as we can exponentiate beforehand
  constructor(n, power = 1n) {
    this.primeFactors = [];
    this.primeFactors.length = PrimeFactorTable.numPrimes;
    this.primeFactors.fill(0n);
    this.remainder = 1n;

    if (n == 0n) {
      this.primeFactors[0] = 1n;
      return;
    } else if (n < 0n) {
      this.primeFactors[1] = power;
      n = -n; // its absolute value
    }

    for (let i = 2; i < PrimeFactorTable.numPrimes && n > 1n; i++) {
      while (n % PrimeFactorTable.primes[i] == 0n) {
        this.primeFactors[i] += power;
        n /= PrimeFactorTable.primes[i];
      }
    }

    if (n != 1n) {
      this.remainder = n ** power;
    }
  }

  multiply(pft) {
    if (pft.equalsZero()) {
      this.primeFactors[0] = 1n;
    } else {
      for (let i = 1; i < PrimeFactorTable.numPrimes; i++) {
        this.primeFactors[i] += pft.primeFactors[i];
      }
      this.remainder *= pft.remainder;
    }
  }

  divideBy(pft) {
    if (pft.equalsZero()) {
      // TODO: throw divide by zero error
    } else {
      for (let i = 1; i < PrimeFactorTable.numPrimes; i++) {
        this.primeFactors[i] -= pft.primeFactors[i];
      }
      this.remainder /= pft.remainder;
    }
  }

  // sum() {}

  square() {
    for (let i = 0; i < PrimeFactorTable.numPrimes; i++) {
      this.primeFactors[i] *= 2n;
    }
    this.remainder *= this.remainder;
  }

  // factorial() {}
  // binomialCoefficient() {}

  equalsZero() {
    return (this.primeFactors[0] != 0n);
  }

  isNegative() {
    return (this.primeFactors[1] % 2n != 0n);
  }

  /* value() {
    if (this.equalsZero()) return 0.0;

    let v = 1.0;
    for (let i = 1; i < PrimeFactorTable.numPrimes; i++) {
      if (this.primeFactors[i] > 0n) {
        v = v*parseFloat(PrimeFactorTable.primes[i] ** this.primeFactors[i]);
      } else if (this.primeFactors[i] < 0n) {
        v = v/parseFloat(PrimeFactorTable.primes[i] ** (-this.primeFactors[i]));
      }
    }
    // TODO: factor in remainder
    return v;
    // return new RationalSqrt(this).value();
  } */

  toString() {
    let sout = "(" + PrimeFactorTable.primes[0] + ", " + this.primeFactors[0] + ")";
    for (let i = 1; i < PrimeFactorTable.numPrimes; i++) {
      sout += ", (" + PrimeFactorTable.primes[i] + ", " + this.primeFactors[i] + ")";
    }
    return sout;
  }
}

/*
Tests:
pft = new PrimeFactorTable((52n*65537n)**2n);
pft1 = new PrimeFactorTable(42n);
pft2 = new PrimeFactorTable(57n);
pft1.multiply(pft2);
pft1.divideBy(pft2);
*/

// =============================================================================
