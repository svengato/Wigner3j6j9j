// =============================================================================
// rational-sqrt.js
// =============================================================================

// Square root of a rational number, in the form (n1*sqrt(n2))/(d1*sqrt(d2))
// where n1, n2, d1, d2 are integers

class RationalSqrt {
  // construct from a PrimeFactorTable
  constructor(pft, sqrtFormat) {
    // this.n1 = 1n;
    this.n2 = 1n;
    this.d1 = 1n;
    this.d2 = 1n;
    if (sqrtFormat == "sqrt") {
      this.sqrtOpen = "sqrt(";
      this.sqrtClose = ")";
    } else {
      // sqrtFormat == "radical" or null
      this.sqrtOpen = "&radic;";
      this.sqrtClose = "";
    }

    if (pft.equalsZero()) {
      this.n1 = 0n;
    } else {
      let sign = (pft.isNegative() ? -1n : 1n);
      this.n1 = sign*sqrtZ(pft.remainder);
      for (let i = 2; i < PrimeFactorTable.numPrimes; i++) {
        if (pft.primeFactors[i] < 0n) {
          let m = -pft.primeFactors[i]; // m = power of PrimeFactorTable.primes[i]
          if (m % 2n != 0n) {
            // odd power of PrimeFactorTable.primes[i]
            this.d2 *= PrimeFactorTable.primes[i];
            for (let j = 1n; j <= ((m - 1n)/2n); j++) this.d1 *= PrimeFactorTable.primes[i];
          } else {
            // even power of PrimeFactorTable.primes[i]
            for (let j = 1n; j <= (m/2n); j++) this.d1 *= PrimeFactorTable.primes[i];
          }
        } else if (pft.primeFactors[i] > 0n) {
          let m = pft.primeFactors[i]; // m = power of PrimeFactorTable.primes[i]
          if (m % 2n != 0n) {
            // odd power of PrimeFactorTable.primes[i]
            this.n2 *= PrimeFactorTable.primes[i];
            for (let j = 1n; j <= ((m - 1n)/2n); j++) this.n1 *= PrimeFactorTable.primes[i];
          } else {
            // even power of PrimeFactorTable.primes[i]
            for (let j = 1n; j <= (m/2n); j++) this.n1 *= PrimeFactorTable.primes[i];
          }
        }
      }
    }
  }

  integerizeNumerator() {
    this.n1 *= this.n2;
    this.d2 *= this.n2;
    this.n2 = 1n;
  }

  value() {
    let vn = parseFloat(this.n1)*Math.sqrt(parseFloat(this.n2))
    let vd = parseFloat(this.d1)*Math.sqrt(parseFloat(this.d2));
    return vn/vd;
  }

  toString() {
    // put in "n1*sqrt(n2) / d1*sqrt(d2)" format
    let sout = "";

    // TODO: wrap [n|d][1|2] in parseInt()?
    if (this.n1 == 1n) {
      if (this.n2 == 1n) {
        sout = this.n1.toString();
      } else {
        sout = this.sqrtOpen + this.n2.toString() + this.sqrtClose;
      }
    } else if (this.n1 == -1n) {
      if (this.n2 == 1n) {
        sout = this.n1.toString();
      } else {
        sout = "-" + this.sqrtOpen + this.n2.toString() + this.sqrtClose;
      }
    } else {
      sout = this.n1.toString();
      if (this.n2 != 1n) {
        sout += " " + this.sqrtOpen + this.n2.toString() + this.sqrtClose;
      }
    }

    if (this.d1 == 1n) {
      if (this.d2 != 1n) {
        sout += " / " + this.sqrtOpen + this.d2.toString() + this.sqrtClose;
      }
    } else {
      sout = sout + " / " + this.d1.toString();
      if (this.d2 != 1n) {
        sout += " " + this.sqrtOpen + this.d2.toString() + this.sqrtClose;
      }
    }

    return sout;
  }
}

// =============================================================================
