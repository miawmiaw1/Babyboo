// src/pages/api/visitors.delete.json.ts
import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

export const DELETE: APIRoute = async () => {
  try {
    if (pool.connection) {
      const { rows } = await pool.pool.query(`SELECT id FROM visitors LIMIT 1`);

      if (rows.length === 0) {
        console.error('No visitors found');
        return new Response(
          JSON.stringify({ error: 'No visitors found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const firstId = rows[0].id;

      const result = await pool.pool.query(
        `UPDATE visitors SET visit = 0 WHERE id = $1 RETURNING *`,
        [firstId]
      );

      if (result.rowCount === 0) {
        console.error('Visitor ID not found');
        return new Response(
          JSON.stringify({ error: 'Visitor ID not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify(result.rows[0]),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      console.error('Failed to fetch visitor entry');
      return new Response(
        JSON.stringify({ error: 'Failed to fetch visitor entry' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Database not connected');
    return new Response(
      JSON.stringify({ error: 'Database not connected' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};