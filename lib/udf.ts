// lib/udf.ts
import { z } from "zod";

/**
 * Basit bir UDF formatı desteği:
 * 1) Önce JSON denemesi (en sağlam yol)
 * 2) Olmazsa satır bazlı "Key: Value" çifti denemesi
 * 3) En sonda querystring benzeri "a=1&b=2" gibi denemesi
 */

const LooseRecord = z.record(z.any());

export type UdfData = Record<string, unknown>;

function tryJson(text: string): UdfData | null {
  try {
    const obj = JSON.parse(text);
    const parsed = LooseRecord.safeParse(obj);
    return parsed.success ? (parsed.data as UdfData) : null;
  } catch {
    return null;
  }
}

function tryKeyValue(text: string): UdfData | null {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return null;

  const obj: UdfData = {};
  let hit = 0;
  for (const line of lines) {
    const m = line.match(/^([^:#=]+)\s*[:=]\s*(.+)$/); // key: value | key=value
    if (!m) continue;
    const key = m[1].trim();
    const raw = m[2].trim();
    // Basit tip kestirimi: number/bool/JSON
    let val: unknown = raw;
    if (/^(true|false)$/i.test(raw)) val = /^true$/i.test(raw);
    else if (/^-?\d+(\.\d+)?$/.test(raw)) val = Number(raw);
    else {
      try {
        val = JSON.parse(raw);
      } catch {
        // string kalsın
      }
    }
    obj[key] = val;
    hit++;
  }
  return hit > 0 ? obj : null;
}

function tryQueryString(text: string): UdfData | null {
  if (!text.includes("&") || !text.includes("=")) return null;
  const obj: UdfData = {};
  for (const part of text.split("&")) {
    const [k, v] = part.split("=");
    if (!k) continue;
    const key = decodeURIComponent(k.trim());
    const raw = decodeURIComponent((v ?? "").trim());
    let val: unknown = raw;
    if (/^(true|false)$/i.test(raw)) val = /^true$/i.test(raw);
    else if (/^-?\d+(\.\d+)?$/.test(raw)) val = Number(raw);
    else {
      try {
        val = JSON.parse(raw);
      } catch {
        // string kalsın
      }
    }
    obj[key] = val;
  }
  return Object.keys(obj).length ? obj : null;
}

export function parseUDF(text: string): UdfData {
  const strategies = [tryJson, tryKeyValue, tryQueryString];
  for (const s of strategies) {
    const out = s(text);
    if (out) return out;
  }
  // Hiçbiri olmadıysa ham metni döndür
  return { _raw: text };
}



