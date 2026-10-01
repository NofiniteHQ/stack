/**
 * @nofinite/charts - Universal Data Normalizer
 * Handles diverse data contracts: { x, y }, { label, value }, { date, value },
 * raw numbers, timestamps, and custom accessors.
 */

export interface NormalizedDataPoint {
  id: string | number;
  label: string;
  x: number | Date;
  xOriginal: any;
  y: number;
  color?: string;
  raw: any;
}

export interface DataAccessorOptions {
  xAccessor?: (d: any) => number | Date | string;
  yAccessor?: (d: any) => number;
  labelAccessor?: (d: any) => string;
  valueAccessor?: (d: any) => number;
}

export function parseDateSafe(val: any): Date | null {
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

export function normalizeData(
  rawData: any[],
  options: DataAccessorOptions = {}
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

    // 2. Resolve Y / Value
    let y = 0;
    if (yAccessor) {
      y = yAccessor(item);
    } else if (valueAccessor) {
      y = valueAccessor(item);
    } else if (item.y !== undefined) {
      y = Number(item.y);
    } else if (item.value !== undefined) {
      y = Number(item.value);
    } else if (item.val !== undefined) {
      y = Number(item.val);
    } else if (item.count !== undefined) {
      y = Number(item.count);
    } else if (item.secondaryValue !== undefined) {
      y = Number(item.secondaryValue);
    }
    if (typeof y !== 'number' || isNaN(y)) {
      y = 0;
    }

    // 3. Resolve X / Date / Time
    let xRaw: any;
    if (xAccessor) {
      xRaw = xAccessor(item);
    } else if (item.date !== undefined) {
      xRaw = item.date;
    } else if (item.timestamp !== undefined) {
      xRaw = item.timestamp;
    } else if (item.time !== undefined) {
      xRaw = item.time;
    } else if (item.x !== undefined) {
      xRaw = item.x;
    } else if (item.label !== undefined) {
      xRaw = item.label;
    } else if (item.name !== undefined) {
      xRaw = item.name;
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
    } else if (item.label !== undefined) {
      label = String(item.label);
    } else if (item.name !== undefined) {
      label = String(item.name);
    } else if (item.x !== undefined && typeof item.x === 'string') {
      label = item.x;
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
      id: item.id ?? index,
      label,
      x,
      xOriginal: xRaw,
      y,
      color: item.color,
      raw: item,
    };
  });
}
