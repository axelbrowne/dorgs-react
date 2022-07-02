interface Color {
  toString(): string;
}

class RGB implements Color {
  r: number;
  g: number;
  b: number;

  constructor(red: number, green: number, blue: number) {
    this.r = red;
    this.g = green;
    this.b = blue;
  }

  /**
  * Converts an RGB color value to HSL. Conversion formula
  * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
  * Assumes r, g, and b are contained in the set [0, 255] and
  * returns h, s, and l in the set [0, 1].
  */
  toHsl(){
    const r = this.r / 255
    const g = this.g / 255
    const b = this.b / 255
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if(max == min){
      h = s = 0; // achromatic
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max){
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return new HSL(h,s,l);
  }

  saturate() {
    let color = this.toHsl()
    color.s = 1;
    return color.toRgb();
  }

  toString() {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }
}

class HSL implements Color {
  h: number
  s: number
  l: number

  constructor(hue: number, saturation: number, lightness: number) {
    this.h = hue;
    this.s = saturation;
    this.l = lightness;
  }

  /**
  * Converts an HSL color value to RGB. Conversion formula
  * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
  * Assumes h, s, and l are contained in the set [0, 1] and
  * returns r, g, and b in the set [0, 255].
  */
  toRgb(){
      let r, g, b;

      if (this.s == 0){
          r = g = b = this.l; // achromatic
      } else {
          let hue2rgb = function hue2rgb(p, q, t){
              if(t < 0) t += 1;
              if(t > 1) t -= 1;
              if(t < 1/6) return p + (q - p) * 6 * t;
              if(t < 1/2) return q;
              if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
              return p;
          }

          let q = this.l < 0.5 ? this.l * (1 + this.s) : this.l + this.s - this.l * this.s;
          let p = 2 * this.l - q;
          r = hue2rgb(p, q, this.h + 1/3);
          g = hue2rgb(p, q, this.h);
          b = hue2rgb(p, q, this.h - 1/3);
      }

      return new RGB(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
  }
  
  toString() {
    return `hsl(${this.h*360}, ${this.s}, ${this.l})`
  }
}

class Hex implements Color {
  hex: string;
  constructor(hexString: string) {
    if (hexString.length !== 6) 
      throw new Error("Enter in a 6-digit hexidecimal string without a leading '#'")
    this.hex = hexString
  }

  toRgb() {
    return new RGB(
      parseInt(this.hex.substring(0, 2), 16) / 255,
      parseInt(this.hex.substring(2,4), 16) / 255,
      parseInt(this.hex.substring(4,6), 16) / 255
    )
  }

  toString() {
    return `#${this.hex}`
  }
}

class LinearGradient {
  stops: Array<RGB>;

  constructor(stops: Array<RGB>) {
    this.stops = stops;
  }

  colorAt(value: number) {
    const stopLength = 1 / (this.stops.length - 1);
    const valueRatio = value / stopLength;
    const stopIndex = Math.floor(valueRatio);
    if (stopIndex === (this.stops.length - 1)) {
      return this.stops[this.stops.length - 1];
    }
    const stopFraction = valueRatio % 1;
    return this.lerp(this.stops[stopIndex], this.stops[stopIndex + 1], stopFraction);
  }

  lerp(startColor: RGB, endColor: RGB, value: number) {
    return new RGB(
      startColor.r + (endColor.r - startColor.r) * value,
      startColor.g + (endColor.g - startColor.g) * value,
      startColor.b + (endColor.b - startColor.b) * value,
    )
  }
}

export {RGB, HSL, LinearGradient}