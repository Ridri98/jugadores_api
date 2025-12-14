const express = require('express');
const app = express();
const cors = require('cors');
const fetch = require('node-fetch');

const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// ✅ CONFIG SUPABASE (TU URL + TU KEY)
const SUPABASE_URL = "https://xisfxzxskdghtzologjd.supabase.co";
const SUPABASE_API_KEY = "sb_secret_IQE8Js2P1_vM7968dlbzfg_FuqIRG8h";

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
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/Jugador?select=*`,
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

/* ============================================================
   ✅ CREAR JUGADOR
   ============================================================ */
app.post('/jugadores/crear', async (req, res) => {
    const jugadorData = req.body;

    if (!jugadorData.nombre || !jugadorData.clubId || !jugadorData.paisId) {
        return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, clubId, paisId.' });
    }

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/Jugadores`, {
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
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/Jugadores?id=eq.${id}`,
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
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/Jugadores?id=eq.${id}`,
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
   ✅ SERVIDOR LOCAL (solo en desarrollo)
   ============================================================ */
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}

module.exports = app;
