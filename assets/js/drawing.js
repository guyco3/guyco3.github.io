(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const canvas = document.getElementById('drawing-canvas');
        const ctx = canvas.getContext('2d');

        const mouseModeBtn = document.getElementById('mouse-mode');
        const drawModeBtn = document.getElementById('draw-mode');
        const eraseModeBtn = document.getElementById('erase-mode');
        const clearModeBtn = document.getElementById('clear-mode');
        const controls = document.querySelectorAll('.draw-control');

        let isDrawing = false;
        let mode = 'none'; // 'draw', 'erase', 'none'
        let lastX = 0;
        let lastY = 0;

        // Store drawing on an offscreen canvas to persist through resizes
        let drawingData = null;

        function resizeCanvas() {
            // Save current drawing
            if (canvas.width > 0 && canvas.height > 0) {
                drawingData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            }
            
            // Resize to full document size
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
            
            canvas.width = docWidth;
            canvas.height = docHeight;
            
            // Restore drawing if it exists
            if (drawingData) {
                ctx.putImageData(drawingData, 0, 0);
            }
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        function getMousePos(e) {
            // Use pageX/pageY which includes scroll offset
            return {
                x: e.pageX,
                y: e.pageY
            };
        }

        function startPosition(e) {
            if (mode === 'none') return;
            
            // Use elementsFromPoint to check what's actually under the cursor
            const elements = document.elementsFromPoint(e.clientX, e.clientY);
            const isOverButton = elements.some(el => 
                el.tagName === 'BUTTON' || 
                el.classList.contains('draw-control') || 
                el.classList.contains('theme-toggle') ||
                el.closest('button')
            );
            
            if (isOverButton) {
                // Don't start drawing, let the button handle the click
                return;
            }
            
            isDrawing = true;
            const pos = getMousePos(e);
            lastX = pos.x;
            lastY = pos.y;
            
            // Start a new path
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
        }

        function endPosition() {
            if (isDrawing) {
                isDrawing = false;
                ctx.beginPath();
            }
        }

        function draw(e) {
            if (!isDrawing) return;

            const pos = getMousePos(e);
            
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            if (mode === 'draw') {
                ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#000';
                ctx.globalCompositeOperation = 'source-over';
            } else if (mode === 'erase') {
                ctx.strokeStyle = 'rgba(0,0,0,1)';
                ctx.globalCompositeOperation = 'destination-out';
                ctx.lineWidth = 20;
            }

            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            
            lastX = pos.x;
            lastY = pos.y;
        }

        function setActiveControl(selectedBtn) {
            controls.forEach(btn => btn.classList.remove('active'));
            selectedBtn.classList.add('active');
        }

        mouseModeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mode = 'none';
            canvas.style.pointerEvents = 'none';
            document.body.classList.remove('drawing-mode', 'erasing-mode');
            setActiveControl(mouseModeBtn);
        });

        drawModeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mode = 'draw';
            canvas.style.pointerEvents = 'auto';
            document.body.classList.remove('erasing-mode');
            document.body.classList.add('drawing-mode');
            setActiveControl(drawModeBtn);
        });

        eraseModeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mode = 'erase';
            canvas.style.pointerEvents = 'auto';
            document.body.classList.remove('drawing-mode');
            document.body.classList.add('erasing-mode');
            setActiveControl(eraseModeBtn);
        });

        clearModeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Clear the entire canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Reset to mouse mode after clearing
            mode = 'none';
            canvas.style.pointerEvents = 'none';
            document.body.classList.remove('drawing-mode', 'erasing-mode');
            setActiveControl(mouseModeBtn);
        });

        canvas.addEventListener('mousedown', startPosition);
        canvas.addEventListener('mouseup', endPosition);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseleave', endPosition);
        
        // Prevent canvas from blocking button clicks
        canvas.addEventListener('click', (e) => {
            // Check if click is on or near a button
            const elements = document.elementsFromPoint(e.clientX, e.clientY);
            const isButton = elements.some(el => 
                el.tagName === 'BUTTON' || 
                el.classList.contains('draw-control') || 
                el.classList.contains('theme-toggle') ||
                el.closest('button')
            );
            
            if (isButton) {
                e.stopPropagation();
                e.preventDefault();
            }
        }, true);

        // Initial state
        canvas.style.pointerEvents = 'none';
        setActiveControl(mouseModeBtn);
    });
})();
