// Copyright (c) Meta Platforms, Inc. and affiliates.
//
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.

import { getDatabase } from '@netlify/database';

const db = getDatabase();

/**
 * Drop-in replacement for `@vercel/postgres`'s `sql` tagged template,
 * backed by Netlify DB instead.
 *
 * `@netlify/database`'s `db.sql` resolves directly to an array of rows,
 * while `@vercel/postgres`'s `sql` resolves to a QueryResult-like object
 * ({ rows, rowCount, command, oid }). This wrapper preserves that original
 * shape so existing call sites (e.g. `const { rows } = await sql\`...\`;`)
 * keep working without any other changes.
 */
export async function sql<T = Record<string, unknown>>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<{ rows: T[]; rowCount: number; command: string; oid: number }> {
  const rows = (await db.sql(strings, ...values)) as T[];
  return { rows, rowCount: rows.length, command: '', oid: 0 };
}
