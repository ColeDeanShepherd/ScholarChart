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

export interface IKeyframeAnimationCurve {
  keyframes: IKeyframe[];
  updateControlledValue: (newValue: number) => void;
}

export interface IKeyframeAnimation {
  curves: IKeyframeAnimationCurve[];
  loop: boolean;
}

export function getKeyframeAnimationDuration(animation: IKeyframeAnimation) {
  // be sure to account for empty curves and curves with no keyframes
  if (animation.curves.length === 0) {
    return 0;
  }

  let duration = animation.curves
    .map(curve => (curve.keyframes.length === 0)
      ? 0
      : curve.keyframes[curve.keyframes.length - 1].time)
    .reduce((a, b) => Math.max(a, b));
  
  return duration;
}

export function runAnimation(
  animation: IKeyframeAnimation
) {
  const animationDurationSec = getKeyframeAnimationDuration(animation);

  let startTimestampMs: number | undefined = undefined;

  function animateHelper(timestampMs: number) {
    if (startTimestampMs === undefined) {
      startTimestampMs = timestampMs;
    }

    const elapsedMs = timestampMs - startTimestampMs;

    let elapsedSec = elapsedMs / 1000;
    if (animation.loop) {
      elapsedSec = elapsedSec % animationDurationSec;
    } else if (elapsedSec >= animationDurationSec) {
      return;
    }
    
    for (const curve of animation.curves) {
      const valueAndPrevKeyframe = getValueAndPrevKeyframeAtTime(curve.keyframes, elapsedSec);
      if (valueAndPrevKeyframe === undefined) {
        requestAnimationFrame(animateHelper);
        return;
      }
  
      const [newValue, prevKeyframe] = valueAndPrevKeyframe;
      
      if (newValue !== undefined) {
        curve.updateControlledValue(newValue);
      }
    }

    requestAnimationFrame(animateHelper);
  }
  
  requestAnimationFrame(animateHelper);
}

export class KeyframeBuilder {
  private keyframes: IKeyframe[] = [];
  private totalDuration: number = 0;

  stepToValue(value: number, duration: number) {
    this.lerpToValue(value, duration);
  }

  lerpToValue(value: number, duration: number) {
    const startTime = (this.keyframes.length === 0)
      ? 0
      : this.keyframes[this.keyframes.length - 1].time;
    const endTime = startTime + duration;

    this.keyframes.push({ time: endTime, value });
    this.totalDuration = endTime;
  }

  wait(duration: number) {
    this.totalDuration += duration;

    if (this.keyframes.length > 0) {
      this.keyframes.push({ time: this.totalDuration, value: this.keyframes[this.keyframes.length - 1].value });
    }
  }

  build() {
    return this.keyframes;
  }
}