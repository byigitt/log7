export interface DiffResult<T> {
  key: keyof T;
  old: unknown;
  new: unknown;
}

export function getDiff<T extends Record<string, unknown>>(
  oldObj: T,
  newObj: T,
  keys: (keyof T)[]
): DiffResult<T>[] {
  const diffs: DiffResult<T>[] = [];

  for (const key of keys) {
    const oldVal = oldObj[key];
    const newVal = newObj[key];

    if (!deepEqual(oldVal, newVal)) {
      diffs.push({
        key,
        old: oldVal,
        new: newVal,
      });
    }
  }

  return diffs;
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((val, i) => deepEqual(val, b[i]));
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const aKeys = Object.keys(a as object);
    const bKeys = Object.keys(b as object);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((key) =>
      deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])
    );
  }

  return false;
}

export function formatDiffValue(value: unknown): string {
  if (value === null || value === undefined) return 'None';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'string') return value || 'Empty';
  if (typeof value === 'number') return value.toString();
  if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : 'None';
  return String(value);
}
