function angleSum(a: number, b: number) {
  return (a + b) % 360
}

function angleDiff(a: number, b: number) {
  return Math.min(360-Math.abs(a-b), Math.abs(a-b))
}

export { angleSum, angleDiff };