<?php
// Simple Flappy Bird clone served via PHP
?><!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Warp Flappy Bird</title>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/style.css">
</head>
<body>
    <main class="game-container">
        <header class="game-header">
            <h1>Warp Flappy Bird</h1>
            <p>Boşluk tuşu ile kuşu uçur. Yeniden başlamak için R tuşuna bas.</p>
        </header>
        <canvas id="game" width="360" height="640" aria-label="Flappy Bird oyunu"></canvas>
        <section class="hud">
            <div class="score-board">
                <span>Skor:</span>
                <strong id="score">0</strong>
            </div>
            <div class="score-board">
                <span>En İyi:</span>
                <strong id="best">0</strong>
            </div>
        </section>
        <footer class="game-footer">
            <p>Bu oyun PHP ile Warp sunucusunda servis edilecek şekilde hazırlanmıştır.</p>
        </footer>
    </main>
    <script src="assets/game.js" type="module"></script>
</body>
</html>
