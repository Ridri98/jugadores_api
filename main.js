const express = require('express');
const app = express();
const cors = require('cors');
const fetch = require('node-fetch');

const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// ✅ CONFIG SUPABASE
// Nota: Usamos process.env para que funcione en Vercel, y el string fijo como respaldo para tu local.
const SUPABASE_URL = process.env.SUPABASE_URL || "https://xisfxzxskdghtzologjd.supabase.co";
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhpc2Z4enhza2RnaHR6b2xvZ2pkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNDU0NjEsImV4cCI6MjA3NDkyMTQ2MX0.9IXz3cAWk7g6BRSSxUUKn1RGHo2OlrUEb0uNCwoq5Vo";

const getSupabaseHeaders = (method = 'GET') => {
    const headers = {
        "apikey": SUPABASE_API_KEY,
        "Authorization": `Bearer ${SUPABASE_API_KEY}`,
        "Content-Type": "application/json",
    };

    if (method === 'POST' || method === 'PATCH') {
        headers['Prefer'] = 'return=representation';
    }
    return headers;
};

/* ============================================================
   ✅ LISTAR JUGADORES
   ============================================================ */
app.get('/jugadores', async (req, res) => {
    try {
        // CORREGIDO: jugador
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/jugador?select=*`,
            { method: "GET", headers: getSupabaseHeaders() }
        );

        const result = await response.json();

        if (response.ok) {
            res.status(200).json(result);
        } else {
            res.status(response.status).json({ error: result.message || 'Error al obtener jugadores.' });
        }
    } catch (error) {
        console.error("Error en /jugadores:", error);
        res.status(500).json({ error: 'Error del servidor al obtener jugadores.' });
    }
});

//Crear
app.post('/jugadores/crear', async (req, res) => {
    const jugadorData = req.body;

if (!jugadorData.Nombre || !jugadorData.Apellido || !jugadorData.id_Clup || !jugadorData.paisId) {
    return res.status(400).json({ error: 'Faltan campos obligatorios: Nombre, Apellido, id_Clup, paisId.' });
}

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/jugador`, {
            method: 'POST',
            headers: getSupabaseHeaders('POST'),
            body: JSON.stringify(jugadorData),
        });

        const result = await response.json();

        if (response.ok && result.length > 0) {
            res.status(201).json({
                success: true,
                jugador: result[0],
                message: 'Jugador creado exitosamente.'
            });
        } else {
            res.status(400).json({ error: result.message || 'Error al crear el jugador.' });
        }
    } catch (error) {
        console.error("Error en /jugadores/crear:", error);
        res.status(500).json({ error: 'Error del servidor al crear jugador.' });
    }
});



/* ============================================================
   ✅ ACTUALIZAR JUGADOR
   ============================================================ */
app.patch('/jugadores/actualizar', async (req, res) => {
    const { id, ...updateData } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'ID del jugador es requerido para actualizar.' });
    }

    try {
        // CORREGIDO: Ahora apunta a 'jugador' (antes decía Jugadores)
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/jugador?id=eq.${id}`,
            {
                method: 'PATCH',
                headers: getSupabaseHeaders('PATCH'),
                body: JSON.stringify(updateData),
            }
        );

        const result = await response.json();

        if (response.ok && result.length > 0) {
            res.status(200).json({
                success: true,
                jugador: result[0],
                message: 'Jugador actualizado exitosamente.'
            });
        } else if (response.ok && result.length === 0) {
            res.status(404).json({ error: 'Jugador no encontrado.' });
        } else {
            res.status(400).json({ error: result.message || 'Error al actualizar jugador.' });
        }
    } catch (error) {
        console.error("Error en /jugadores/actualizar:", error);
        res.status(500).json({ error: 'Error del servidor al actualizar jugador.' });
    }
});

/* ============================================================
   ✅ ELIMINAR JUGADOR
   ============================================================ */
app.delete('/jugadores/:id', async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'ID del jugador es requerido para eliminar.' });
    }

    try {
        // CORREGIDO: Ahora apunta a 'jugador' (antes decía Jugadores)
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/jugador?id=eq.${id}`,
            {
                method: 'DELETE',
                headers: getSupabaseHeaders('DELETE'),
            }
        );

        if (response.ok) {
            res.status(200).json({ success: true, message: 'Jugador eliminado exitosamente.' });
        } else {
            const result = await response.json();
            res.status(400).json({ error: result.message || 'Error al eliminar jugador.' });
        }
    } catch (error) {
        console.error("Error en /jugadores/:id:", error);
        res.status(500).json({ error: 'Error del servidor al eliminar jugador.' });
    }
});

/* ============================================================
   ✅ LISTAR TRANSACCIONES
   ============================================================ */
app.get('/transacciones', async (req, res) => {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/transacciones?select=*`,
            { method: "GET", headers: getSupabaseHeaders() }
        );

        const result = await response.json();

        if (response.ok) {
            res.status(200).json(result);
        } else {
            res.status(response.status).json({ error: result.message || 'Error al obtener transacciones.' });
        }
    } catch (error) {
        console.error("Error en /transacciones:", error);
        res.status(500).json({ error: 'Error del servidor al obtener transacciones.' });
    }
});

/* ============================================================
   ✅ SERVIDOR LOCAL (solo en desarrollo)
   ============================================================ */
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}

module.exports = app;
