document.addEventListener('DOMContentLoaded', () => {
    const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

    function actualizarInformacionPartida(datos) {
        const partidaId = document.getElementById('game-container').dataset.id;

        fetch(`/partida/${partidaId}/actualizar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                [csrfHeader]: csrfToken
            },
            body: JSON.stringify(datos)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Partida actualizada:', data);
        })
        .catch(error => console.error('Error al actualizar la partida:', error));
    }

    // Ejemplo de uso
    actualizarInformacionPartida({
        rondasJugadas: 1,
        piezasRestantes: 4
    });
});