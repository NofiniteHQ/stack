/**
 * @nofinite/charts - Universal Data Normalizer
 * Handles diverse data contracts: { x, y }, { label, value }, { date, value },
 * raw numbers, timestamps, and custom accessors.
 */

export interface NormalizedDataPoint {
  id: string | number;
  label: string;
  x: number | Date;
  xOriginal: unknown;
  y: number;
  color?: string;
  raw: unknown;
}

export interface DataAccessorOptions<T = Record<string, unknown>> {
  xAccessor?: (d: T) => number | Date | string;
  yAccessor?: (d: T) => number;
  labelAccessor?: (d: T) => string;
  valueAccessor?: (d: T) => number;
}

export function parseDateSafe(val: unknown): Date | null {
  if (val instanceof Date && !isNaN(val.getTime())) {
    return val;
  }
  if (typeof val === 'string' && val.trim().length > 0) {
    // If it's a numeric string only (e.g. "12"), don't treat as date
    if (/^\d+(\.\d+)?$/.test(val.trim())) {
      return null;
    }
    const parsed = new Date(val);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  if (typeof val === 'number' && val > 946684800000 && val < 4102444800000) {
    // Epoch timestamp in milliseconds between 2000 and 2100
    const parsed = new Date(val);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return null;
}

export function normalizeData<T = Record<string, unknown>>(
  rawData: T[],
  options: DataAccessorOptions<T> = {}
): NormalizedDataPoint[] {
  if (!Array.isArray(rawData) || rawData.length === 0) {
    return [];
  }

  const { xAccessor, yAccessor, labelAccessor, valueAccessor } = options;

  return rawData.map((item, index) => {
    // 1. Primitive number
    if (typeof item === 'number') {
      return {
        id: index,
        label: String(index + 1),
        x: index,
        xOriginal: index,
        y: isNaN(item) ? 0 : item,
        raw: item,
      };
    }

    if (item == null || typeof item !== 'object') {
      return {
        id: index,
        label: String(index + 1),
        x: index,
        xOriginal: index,
        y: 0,
        raw: item,
      };
    }

    const obj = item as Record<string, unknown>;

    // 2. Resolve Y / Value
    let y = 0;
    if (yAccessor) {
      y = yAccessor(item);
    } else if (valueAccessor) {
      y = valueAccessor(item);
    } else if (obj.y !== undefined) {
      y = Number(obj.y);
    } else if (obj.value !== undefined) {
      y = Number(obj.value);
    } else if (obj.val !== undefined) {
      y = Number(obj.val);
    } else if (obj.count !== undefined) {
      y = Number(obj.count);
    } else if (obj.secondaryValue !== undefined) {
      y = Number(obj.secondaryValue);
    }
    if (typeof y !== 'number' || isNaN(y)) {
      y = 0;
    }

    // 3. Resolve X / Date / Time
    let xRaw: unknown;
    if (xAccessor) {
      xRaw = xAccessor(item);
    } else if (obj.date !== undefined) {
      xRaw = obj.date;
    } else if (obj.timestamp !== undefined) {
      xRaw = obj.timestamp;
    } else if (obj.time !== undefined) {
      xRaw = obj.time;
    } else if (obj.x !== undefined) {
      xRaw = obj.x;
    } else if (obj.label !== undefined) {
      xRaw = obj.label;
    } else if (obj.name !== undefined) {
      xRaw = obj.name;
    } else {
      xRaw = index;
    }

    const parsedDate = parseDateSafe(xRaw);
    let x: number | Date;
    if (parsedDate) {
      x = parsedDate;
    } else if (typeof xRaw === 'number') {
      x = isNaN(xRaw) ? index : xRaw;
    } else {
      // String or categorical: for Cartesian continuous charts, index is continuous coordinate
      x = index;
    }

    // 4. Resolve Label
    let label = '';
    if (labelAccessor) {
      label = String(labelAccessor(item));
    } else if (obj.label !== undefined) {
      label = String(obj.label);
    } else if (obj.name !== undefined) {
      label = String(obj.name);
    } else if (obj.x !== undefined && typeof obj.x === 'string') {
      label = obj.x;
    } else if (parsedDate) {
      label = parsedDate.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    } else if (typeof xRaw === 'string') {
      label = xRaw;
    } else {
      label = String(xRaw);
    }

    return {
      id: (obj.id as string | number) ?? index,
      label,
      x,
      xOriginal: xRaw,
      y,
      color: typeof obj.color === 'string' ? obj.color : undefined,
      raw: item,
    };
  });
}
