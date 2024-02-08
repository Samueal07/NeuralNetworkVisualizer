function lerp(A, B, t) {
  //when t is 0 only A
  // when t is 1 B remains
  // when t is between 0 and 1, the result is a value between A and B
  return A + (B - A) * t;
}
