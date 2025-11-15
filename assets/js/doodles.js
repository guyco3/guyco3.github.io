(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const canvas = document.createElement('canvas');
        canvas.id = 'doodles-canvas';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '0';
        document.body.insertBefore(canvas, document.body.firstChild);

        const ctx = canvas.getContext('2d');
        let doodlePositions = [];

        function resizeCanvas() {
            const dpr = window.devicePixelRatio || 1;
            const docHeight = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            );
            const docWidth = Math.max(
                document.body.scrollWidth,
                document.body.offsetWidth,
                document.documentElement.clientWidth,
                document.documentElement.scrollWidth,
                document.documentElement.offsetWidth
            );
            
            canvas.width = docWidth * dpr;
            canvas.height = docHeight * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = docWidth + 'px';
            canvas.style.height = docHeight + 'px';
            
            // Regenerate doodles on resize
            generateDoodlePositions();
            drawAllDoodles();
        }

        function getColor() {
            const theme = document.documentElement.getAttribute('data-theme');
            return theme === 'dark' ? '#ffffff' : '#000000';
        }

        // Add slight random variation to points for hand-drawn effect
        function jitter(value, amount = 1) {
            return value + (Math.random() - 0.5) * amount;
        }

        // Draw with a sketchy, hand-drawn line
        function sketchLine(x1, y1, x2, y2) {
            const steps = 20;
            ctx.beginPath();
            ctx.moveTo(jitter(x1, 0.5), jitter(y1, 0.5));
            
            for (let i = 1; i <= steps; i++) {
                const t = i / steps;
                const x = x1 + (x2 - x1) * t;
                const y = y1 + (y2 - y1) * t;
                ctx.lineTo(jitter(x, 0.8), jitter(y, 0.8));
            }
            
            ctx.stroke();
        }

        // Draw a sketchy circle
        function sketchCircle(x, y, radius, filled = false) {
            const points = 40;
            ctx.beginPath();
            
            for (let i = 0; i <= points; i++) {
                const angle = (i / points) * Math.PI * 2;
                const r = jitter(radius, 0.5);
                const px = x + Math.cos(angle) * r;
                const py = y + Math.sin(angle) * r;
                
                if (i === 0) {
                    ctx.moveTo(px, py);
                } else {
                    ctx.lineTo(px, py);
                }
            }
            
            if (filled) {
                ctx.fill();
            }
            ctx.stroke();
        }

        // Draw a smiley face
        function drawSmiley(x, y, size) {
            ctx.strokeStyle = getColor();
            ctx.fillStyle = getColor();
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.15;
            
            // Face
            sketchCircle(x, y, size);
            
            // Eyes
            const eyeY = y - size * 0.2;
            sketchCircle(x - size * 0.3, eyeY, size * 0.1, true);
            sketchCircle(x + size * 0.3, eyeY, size * 0.1, true);
            
            // Smile
            ctx.beginPath();
            const smileY = y + size * 0.1;
            for (let i = 0; i <= 20; i++) {
                const t = i / 20;
                const angle = Math.PI * 0.2 + t * Math.PI * 0.6;
                const px = x + Math.cos(angle) * size * 0.5;
                const py = smileY + Math.sin(angle) * size * 0.5;
                
                if (i === 0) {
                    ctx.moveTo(jitter(px, 0.5), jitter(py, 0.5));
                } else {
                    ctx.lineTo(jitter(px, 0.8), jitter(py, 0.8));
                }
            }
            ctx.stroke();
            
            ctx.globalAlpha = 1;
        }

        // Draw a tic-tac-toe grid
        function drawTicTacToe(x, y, size) {
            ctx.strokeStyle = getColor();
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.15;
            
            const cell = size / 3;
            
            // Grid lines
            sketchLine(x + cell, y, x + cell, y + size);
            sketchLine(x + cell * 2, y, x + cell * 2, y + size);
            sketchLine(x, y + cell, x + size, y + cell);
            sketchLine(x, y + cell * 2, x + size, y + cell * 2);
            
            // Random X's and O's
            const positions = [
                [x + cell * 0.5, y + cell * 0.5],
                [x + cell * 1.5, y + cell * 0.5],
                [x + cell * 2.5, y + cell * 0.5],
                [x + cell * 0.5, y + cell * 1.5],
                [x + cell * 1.5, y + cell * 1.5],
                [x + cell * 2.5, y + cell * 1.5],
                [x + cell * 0.5, y + cell * 2.5],
                [x + cell * 1.5, y + cell * 2.5],
                [x + cell * 2.5, y + cell * 2.5]
            ];
            
            // Randomly fill 4-6 cells
            const numFilled = 4 + Math.floor(Math.random() * 3);
            const shuffled = positions.sort(() => Math.random() - 0.5);
            
            for (let i = 0; i < numFilled; i++) {
                const [px, py] = shuffled[i];
                const isX = Math.random() > 0.5;
                
                if (isX) {
                    // Draw X
                    const offset = cell * 0.3;
                    sketchLine(px - offset, py - offset, px + offset, py + offset);
                    sketchLine(px + offset, py - offset, px - offset, py + offset);
                } else {
                    // Draw O
                    sketchCircle(px, py, cell * 0.3);
                }
            }
            
            ctx.globalAlpha = 1;
        }

        // Draw a star
        function drawStar(x, y, size) {
            ctx.strokeStyle = getColor();
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.15;
            
            const points = 5;
            const outerRadius = size;
            const innerRadius = size * 0.4;
            
            ctx.beginPath();
            for (let i = 0; i < points * 2; i++) {
                const angle = (i * Math.PI) / points - Math.PI / 2;
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const px = x + Math.cos(angle) * jitter(radius, 1);
                const py = y + Math.sin(angle) * jitter(radius, 1);
                
                if (i === 0) {
                    ctx.moveTo(px, py);
                } else {
                    ctx.lineTo(px, py);
                }
            }
            ctx.closePath();
            ctx.stroke();
            
            ctx.globalAlpha = 1;
        }

        // Draw a heart
        function drawHeart(x, y, size) {
            ctx.strokeStyle = getColor();
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.15;
            
            ctx.beginPath();
            const topY = y - size * 0.3;
            
            // Draw heart shape with jitter
            for (let t = 0; t <= 1; t += 0.02) {
                const angle = t * Math.PI * 2;
                const px = x + jitter(size * 16 * Math.pow(Math.sin(angle), 3) / 16, 0.8);
                const py = topY + jitter(size * (13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle)) / 16, 0.8);
                
                if (t === 0) {
                    ctx.moveTo(px, py);
                } else {
                    ctx.lineTo(px, py);
                }
            }
            ctx.closePath();
            ctx.stroke();
            
            ctx.globalAlpha = 1;
        }

        // Draw a lightning bolt
        function drawLightning(x, y, size) {
            ctx.strokeStyle = getColor();
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.15;
            
            ctx.beginPath();
            const points = [
                [x, y],
                [x + size * 0.2, y + size * 0.4],
                [x - size * 0.1, y + size * 0.4],
                [x + size * 0.1, y + size * 0.8],
                [x - size * 0.3, y + size * 0.5],
                [x - size * 0.1, y + size * 0.5],
                [x - size * 0.2, y]
            ];
            
            ctx.moveTo(jitter(points[0][0], 0.5), jitter(points[0][1], 0.5));
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(jitter(points[i][0], 0.8), jitter(points[i][1], 0.8));
            }
            ctx.closePath();
            ctx.stroke();
            
            ctx.globalAlpha = 1;
        }

        // Draw a simple flower
        function drawFlower(x, y, size) {
            ctx.strokeStyle = getColor();
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.15;
            
            // Center
            sketchCircle(x, y, size * 0.2);
            
            // Petals
            const petals = 6;
            for (let i = 0; i < petals; i++) {
                const angle = (i / petals) * Math.PI * 2;
                const px = x + Math.cos(angle) * size * 0.5;
                const py = y + Math.sin(angle) * size * 0.5;
                sketchCircle(px, py, size * 0.25);
            }
            
            ctx.globalAlpha = 1;
        }

        // Draw a simple cloud
        function drawCloud(x, y, size) {
            ctx.strokeStyle = getColor();
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.15;
            
            sketchCircle(x - size * 0.3, y, size * 0.3);
            sketchCircle(x, y - size * 0.1, size * 0.4);
            sketchCircle(x + size * 0.3, y, size * 0.3);
            
            ctx.globalAlpha = 1;
        }

        // Draw a musical note
        function drawMusicNote(x, y, size) {
            ctx.strokeStyle = getColor();
            ctx.fillStyle = getColor();
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.15;
            
            // Note head
            sketchCircle(x, y + size * 0.6, size * 0.15, true);
            
            // Stem
            sketchLine(x + size * 0.15, y + size * 0.6, x + size * 0.15, y);
            
            // Flag
            ctx.beginPath();
            ctx.moveTo(x + size * 0.15, y);
            ctx.quadraticCurveTo(
                jitter(x + size * 0.4, 0.5), jitter(y + size * 0.1, 0.5),
                jitter(x + size * 0.3, 0.5), jitter(y + size * 0.3, 0.5)
            );
            ctx.stroke();
            
            ctx.globalAlpha = 1;
        }

        // Draw a simple sun
        function drawSun(x, y, size) {
            ctx.strokeStyle = getColor();
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.15;
            
            // Center
            sketchCircle(x, y, size * 0.4);
            
            // Rays
            const rays = 8;
            for (let i = 0; i < rays; i++) {
                const angle = (i / rays) * Math.PI * 2;
                const x1 = x + Math.cos(angle) * size * 0.5;
                const y1 = y + Math.sin(angle) * size * 0.5;
                const x2 = x + Math.cos(angle) * size * 0.8;
                const y2 = y + Math.sin(angle) * size * 0.8;
                sketchLine(x1, y1, x2, y2);
            }
            
            ctx.globalAlpha = 1;
        }

        // Draw a simple arrow
        function drawArrow(x, y, size) {
            ctx.strokeStyle = getColor();
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.15;
            
            const angle = Math.random() * Math.PI * 2;
            const x2 = x + Math.cos(angle) * size;
            const y2 = y + Math.sin(angle) * size;
            
            sketchLine(x, y, x2, y2);
            
            // Arrowhead
            const headAngle1 = angle + Math.PI * 0.8;
            const headAngle2 = angle - Math.PI * 0.8;
            const headSize = size * 0.3;
            
            sketchLine(x2, y2, x2 + Math.cos(headAngle1) * headSize, y2 + Math.sin(headAngle1) * headSize);
            sketchLine(x2, y2, x2 + Math.cos(headAngle2) * headSize, y2 + Math.sin(headAngle2) * headSize);
            
            ctx.globalAlpha = 1;
        }

        const doodleTypes = [
            drawSmiley,
            drawTicTacToe,
            drawStar,
            drawHeart,
            drawLightning,
            drawFlower,
            drawCloud,
            drawMusicNote,
            drawSun,
            drawArrow
        ];

        function generateDoodlePositions(density = 0.00001) {
            doodlePositions = [];
            const docHeight = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            );
            const docWidth = Math.max(
                document.body.scrollWidth,
                document.body.offsetWidth,
                document.documentElement.clientWidth,
                document.documentElement.scrollWidth,
                document.documentElement.offsetWidth
            );
            
            // Calculate number of doodles based on page area and density
            const pageArea = docWidth * docHeight;
            const numDoodles = Math.floor(pageArea * density);
            
            for (let i = 0; i < numDoodles; i++) {
                doodlePositions.push({
                    x: Math.random() * docWidth,
                    y: Math.random() * docHeight,
                    size: 30 + Math.random() * 40, // Size between 30-70px
                    scale: 0.7 + Math.random() * 0.6, // Scale between 0.7-1.3
                    rotation: (Math.random() - 0.5) * Math.PI * 0.4, // Rotation between -36° to +36°
                    type: doodleTypes[Math.floor(Math.random() * doodleTypes.length)]
                });
            }
        }

        function drawAllDoodles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            doodlePositions.forEach(doodle => {
                ctx.save();
                
                // Apply transformations
                ctx.translate(doodle.x, doodle.y);
                ctx.rotate(doodle.rotation);
                ctx.scale(doodle.scale, doodle.scale);
                
                // Draw doodle at origin since we've translated
                doodle.type(0, 0, doodle.size);
                
                ctx.restore();
            });
        }

        // Redraw doodles when theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    drawAllDoodles();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
    });
})();
