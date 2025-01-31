function distance2D(a, b) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return Math.sqrt(dx * dx + dy * dy);
}

export default function pointOnLineWithElevation(line, point) {
  if (line.length < 2) throw new Error("Line must have at least two points");

  let closestPoint = null;
  let closestDistance = Infinity;
  let closestSegmentIndex = -1;

  for (let i = 0; i < line.length - 1; i++) {
    const start = line[i];
    const end = line[i + 1];
    const proj = projectPointOnSegment2D(point, start, end);

    // Measure distance in 2D
    const dist = distance2D(proj, point);
    if (dist < closestDistance) {
      closestDistance = dist;
      closestPoint = proj;
      closestSegmentIndex = i;
    }
  }

  return { point: closestPoint, segmentIndex: closestSegmentIndex };
}

function projectPointOnSegment2D(point, start, end) {
  // 2D vector for the segment
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];

  // If segment is a single point in 2D
  if (dx === 0 && dy === 0) {
    // Just return start (or end—they're the same)
    return [...start];
  }

  // Compute the projection factor using 2D dot product
  const t =
    ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) /
    (dx * dx + dy * dy);

  // Clamp between 0 and 1
  const clampedT = Math.max(0, Math.min(1, t));

  // Interpolate X,Y
  const x = start[0] + clampedT * dx;
  const y = start[1] + clampedT * dy;

  // Interpolate Z if both endpoints have it
  const zStart = start.length > 2 ? start[2] : null;
  const zEnd = end.length > 2 ? end[2] : null;
  let z = null;
  if (zStart != null && zEnd != null) {
    const dz = zEnd - zStart;
    z = zStart + clampedT * dz;
  }

  // Return either [x,y,z] or [x,y]
  return z != null ? [x, y, z] : [x, y];
}
