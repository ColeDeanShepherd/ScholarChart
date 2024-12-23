export interface IKeyframe {
  time: number;
  value: number;
}

export function stepInterpolate(start: number, end: number, t: number) {
  return t < 1 ? start : end;
}

export function linearInterpolate(start: number, end: number, t: number) {
  return start + (t * (end - start));
}

export function cubicInterpolate(start: number, end: number, t: number) {
  return start + (t * t * (3.0 - 2.0 * t) * (end - start));
}

export function getPrevKeyframeIndex(keyframes: IKeyframe[], elapsedSec: number) {
  // TODO: Use binary search.
  for (let i = (keyframes.length - 1); i >= 0; i--) {
    if (keyframes[i].time <= elapsedSec) {
      return i;
    }
  }

  return undefined;
}

export function getValueAndPrevKeyframeAtTime(
  keyframes: IKeyframe[],
  elapsedSec: number
): [number, IKeyframe] | undefined {
  const prevKeyframeIndex = getPrevKeyframeIndex(keyframes, elapsedSec);
  if (prevKeyframeIndex === undefined) {
    return undefined;
  }
  
  const prevKeyframe = keyframes[prevKeyframeIndex];

  const nextKeyframeIndex = prevKeyframeIndex + 1;
  if (nextKeyframeIndex >= keyframes.length) {
    return [prevKeyframe.value, prevKeyframe];
  }

  const nextKeyframe = keyframes[nextKeyframeIndex];

  const progressPct = (elapsedSec - prevKeyframe.time) / (nextKeyframe.time - prevKeyframe.time);
  const value = cubicInterpolate(prevKeyframe.value, nextKeyframe.value, progressPct);

  return [value, prevKeyframe];
}

export function getValueAtTime(
  keyframes: IKeyframe[],
  elapsedSec: number
): number | undefined {
  const valueAndPrevKeyframe = getValueAndPrevKeyframeAtTime(keyframes, elapsedSec);
  if (valueAndPrevKeyframe === undefined) {
    return undefined;
  }

  return valueAndPrevKeyframe[0];
}

export function animate(
  keyframes: IKeyframe[],
  loop: boolean,
  updateControlledValue: (newValue: number) => void
) {
  if (keyframes.length === 0) {
    return;
  }

  const animationDurationSec = keyframes[keyframes.length - 1].time;

  let startTimestampMs: number | undefined = undefined;

  function animateHelper(timestampMs: number) {
    if (startTimestampMs === undefined) {
      startTimestampMs = timestampMs;
    }

    const elapsedMs = timestampMs - startTimestampMs;

    let elapsedSec = elapsedMs / 1000;
    if (loop) {
      elapsedSec = elapsedSec % animationDurationSec;
    } else if (elapsedSec >= animationDurationSec) {
      return;
    }
    
    // use getValueAndPrevKeyframeAtTime() to get the value and the previous keyframe at the current time
    const valueAndPrevKeyframe = getValueAndPrevKeyframeAtTime(keyframes, elapsedSec);
    if (valueAndPrevKeyframe === undefined) {
      requestAnimationFrame(animateHelper);
      return;
    }

    const [newValue, prevKeyframe] = valueAndPrevKeyframe;
    
    if (newValue !== undefined) {
      updateControlledValue(newValue);
    }

    requestAnimationFrame(animateHelper);
  }
  
  requestAnimationFrame(animateHelper);
}