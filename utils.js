function lerp(A, B, t) {
  //when t is 0 only A
  // when t is 1 B remains
  // when t is between 0 and 1, the result is a value between A and B
  return A + (B - A) * t;
}

function getIntersection(A, B, C, D) {
  // Calculate the numerator of the parametric expression for line segment CD at the x-coordinate of point A
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);

  // Calculate the numerator of the parametric expression for line segment AB at the x-coordinate of point C
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);

  // Calculate the denominator of the parametric expression for the intersection point
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  // Check if the lines are not parallel (denominator is not zero)
  if (bottom !== 0) {
    // Calculate the parametric values t and u
    const t = tTop / bottom;
    const u = uTop / bottom;

    // Check if t and u are within the range [0, 1], indicating intersection within the line segments
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      // Calculate the intersection point using linear interpolation
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }

  // Return null if there is no intersection
  return null;
}
