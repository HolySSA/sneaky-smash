function calculateDistance(pointA, pointB) {
  const [x1, z1] = pointA;
  const [x2, z2] = pointB;
  return Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);
}

export { calculateDistance };
