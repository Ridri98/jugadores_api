const express = require('express');
const app = express();
const cors = require('cors');
const fetch = require('node-fetch');

const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// ✅ CONFIG SUPABASE
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

// Ruta raíz
app.get('/', (req, res) => {
    res.status(200).json({ status: 'API de Jugadores y Transferencias funcionando correctamente' });
});

/* ============================================================
   ✅ JUGADORES
   ============================================================ */

// Listar Jugadores
app.get('/jugadores', async (req, res) => {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/jugadores?select=*`,
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
// Crear Jugador
app.post('/jugadores/crear', async (req, res) => {
    const jugadorData = req.body;

    if (
        !jugadorData.nombre ||
        !jugadorData.apellido ||
        !jugadorData.fk_id_club ||
        !jugadorData.fk_id_pais
    ) {
        return res.status(400).json({
            error: 'Faltan campos obligatorios: nombre, apellido, fk_id_club, fk_id_pais.'
        });
    }

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/jugadores`, {
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
            res.status(400).json({
                error: result.message || 'Error al crear el jugador.'
            });
        }
    } catch (error) {
        console.error("Error en /jugadores/crear:", error);
        res.status(500).json({
            error: 'Error del servidor al crear jugador.'
        });
    }
});

// Actualizar Jugador
app.patch('/jugadores/actualizar', async (req, res) => {
    const { id_jugador, ...updateData } = req.body;

    if (!id_jugador) {
        return res.status(400).json({
            error: 'El id_jugador es requerido para actualizar.'
        });
    }

    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/jugadores?id_jugador=eq.${id_jugador}`,
            {
                method: 'PATCH',
                headers: getSupabaseHeaders('PATCH'),
                body: JSON.stringify(updateData),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: result.message || result.error || 'Error al actualizar jugador.'
            });
        }

        if (Array.isArray(result) && result.length > 0) {
            return res.status(200).json({
                success: true,
                jugador: result[0],
                message: 'Jugador actualizado exitosamente.'
            });
        }

        return res.status(404).json({
            error: 'Jugador no encontrado.'
        });

    } catch (error) {
        console.error("Error en /jugadores/actualizar:", error);
        res.status(500).json({
            error: 'Error del servidor al actualizar jugador.'
        });
    }
});

app.delete('/jugadores/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/jugadores?id_Jugador=eq.${id}`,
            {
                method: 'DELETE',
                headers: getSupabaseHeaders('DELETE'),
            }
        );
/* ============================================================
   ✅ TRANSFERENCIAS
   ============================================================ */
app.get('/transferencias', async (req, res) => {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/transferencias?select=*`,
            { method: "GET", headers: getSupabaseHeaders() }
        );

        const result = await response.json();

        if (response.ok) {
            res.status(200).json(result);
        } else {
            res.status(response.status).json({ error: result.message || 'Error al obtener transferencias.' });
        }
    } catch (error) {
        console.error("Error en /transferencias:", error);
        res.status(500).json({ error: 'Error del servidor al obtener transferencias.' });
    }
});

/* ============================================================
   ✅ CLUBES
   ============================================================ */
app.get('/clubes', async (req, res) => {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/clubes?select=*`,
            { method: "GET", headers: getSupabaseHeaders() }
        );

        const result = await response.json();

        if (response.ok) {
            res.status(200).json(result);
        } else {
            res.status(response.status).json({ error: result.message || 'Error al obtener clubes.' });
        }
    } catch (error) {
        console.error("Error en /clubes:", error);
        res.status(500).json({ error: 'Error del servidor al obtener clubes.' });
    }
});

/* ============================================================
   ✅ PAÍSES
   ============================================================ */
app.get('/pais', async (req, res) => {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/pais?select=*`,
            { method: "GET", headers: getSupabaseHeaders() }
        );

        const result = await response.json();

        if (response.ok) {
            res.status(200).json(result);
        } else {
            res.status(response.status).json({ error: result.message || 'Error al obtener países.' });
        }
    } catch (error) {
        console.error("Error en /pais:", error);
        res.status(500).json({ error: 'Error del servidor al obtener países.' });
    }
});

// Eliminar País
app.delete('/pais/:id', async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            error: 'ID del país es requerido para eliminar.'
        });
    }

    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/pais?id_pais=eq.${id}`,
            {
                method: 'DELETE',
                headers: getSupabaseHeaders('DELETE'),
            }
        );

        if (response.ok) {
            res.status(200).json({
                success: true,
                message: 'País eliminado exitosamente.'
            });
        } else {
            const result = await response.json();

            res.status(400).json({
                error: result.message || 'Error al eliminar país.'
            });
        }

    } catch (error) {

        console.error("Error en /pais/:id:", error);

        res.status(500).json({
            error: 'Error del servidor al eliminar país.'
        });
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
