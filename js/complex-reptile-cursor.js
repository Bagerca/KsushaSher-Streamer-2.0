// Complex Reptile Cursor System
const ComplexReptileCursor = {
    isActive: false,
    canvas: null,
    ctx: null,
    animationId: null,
    critter: null,

    init() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.setupCanvas();
        this.setupInput();
        this.createCreature();
        this.startAnimation();
        
        // Hide default cursor
        document.body.style.cursor = 'none';
    },

    destroy() {
        this.isActive = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        // Restore default cursor
        document.body.style.cursor = '';
        
        // Remove input event listeners
        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("keyup", this.handleKeyUp);
        document.removeEventListener("mousedown", this.handleMouseDown);
        document.removeEventListener("mouseup", this.handleMouseUp);
        document.removeEventListener("mousemove", this.handleMouseMove);
    },

    setupCanvas() {
        this.canvas = document.createElement("canvas");
        document.body.appendChild(this.canvas);
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.position = "fixed";
        this.canvas.style.left = "0px";
        this.canvas.style.top = "0px";
        this.canvas.style.pointerEvents = "none";
        this.canvas.style.zIndex = "9999";
        this.canvas.style.backgroundColor = "transparent";
        
        this.ctx = this.canvas.getContext("2d");
        this.ctx.strokeStyle = "#00ff00";
        this.ctx.lineWidth = 2;
    },

    setupInput() {
        this.Input = {
            keys: [],
            mouse: {
                left: false,
                right: false,
                middle: false,
                x: window.innerWidth / 2,
                y: window.innerHeight / 2
            }
        };

        // Initialize keys array
        for (let i = 0; i < 230; i++) {
            this.Input.keys.push(false);
        }

        // Bind event handlers
        this.handleKeyDown = (event) => { this.Input.keys[event.keyCode] = true; };
        this.handleKeyUp = (event) => { this.Input.keys[event.keyCode] = false; };
        this.handleMouseDown = (event) => {
            if (event.button === 0) this.Input.mouse.left = true;
            if (event.button === 1) this.Input.mouse.middle = true;
            if (event.button === 2) this.Input.mouse.right = true;
        };
        this.handleMouseUp = (event) => {
            if (event.button === 0) this.Input.mouse.left = false;
            if (event.button === 1) this.Input.mouse.middle = false;
            if (event.button === 2) this.Input.mouse.right = false;
        };
        this.handleMouseMove = (event) => {
            this.Input.mouse.x = event.clientX;
            this.Input.mouse.y = event.clientY;
        };

        // Add event listeners
        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keyup", this.handleKeyUp);
        document.addEventListener("mousedown", this.handleMouseDown);
        document.addEventListener("mouseup", this.handleMouseUp);
        document.addEventListener("mousemove", this.handleMouseMove);
    },

    createCreature() {
        const legNum = Math.floor(3 + Math.random() * 6);
        this.setupLizard(
            8 / Math.sqrt(legNum),
            legNum,
            Math.floor(8 + Math.random() * legNum * 4)
        );
    },

    startAnimation() {
        const animate = () => {
            if (!this.isActive) return;
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            if (this.critter) {
                this.critter.follow(this.Input.mouse.x, this.Input.mouse.y);
            }
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    },

    // Segment class
    Segment: class {
        constructor(parent, size, angle, range, stiffness) {
            this.isSegment = true;
            this.parent = parent;
            if (typeof parent.children == "object") {
                parent.children.push(this);
            }
            this.children = [];
            this.size = size;
            this.relAngle = angle;
            this.defAngle = angle;
            this.absAngle = parent.absAngle + angle;
            this.range = range;
            this.stiffness = stiffness;
            this.updateRelative(false, true);
        }

        updateRelative(iter, flex) {
            this.relAngle = this.relAngle - 2 * Math.PI * Math.floor((this.relAngle - this.defAngle) / 2 / Math.PI + 1 / 2);
            if (flex) {
                this.relAngle = Math.min(
                    this.defAngle + this.range / 2,
                    Math.max(
                        this.defAngle - this.range / 2,
                        (this.relAngle - this.defAngle) / this.stiffness + this.defAngle
                    )
                );
            }
            this.absAngle = this.parent.absAngle + this.relAngle;
            this.x = this.parent.x + Math.cos(this.absAngle) * this.size;
            this.y = this.parent.y + Math.sin(this.absAngle) * this.size;
            if (iter) {
                for (let i = 0; i < this.children.length; i++) {
                    this.children[i].updateRelative(iter, flex);
                }
            }
        }

        draw(iter) {
            ComplexReptileCursor.ctx.beginPath();
            ComplexReptileCursor.ctx.moveTo(this.parent.x, this.parent.y);
            ComplexReptileCursor.ctx.lineTo(this.x, this.y);
            ComplexReptileCursor.ctx.stroke();
            if (iter) {
                for (let i = 0; i < this.children.length; i++) {
                    this.children[i].draw(true);
                }
            }
        }

        follow(iter) {
            const x = this.parent.x;
            const y = this.parent.y;
            const dist = Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2);
            this.x = x + this.size * (this.x - x) / dist;
            this.y = y + this.size * (this.y - y) / dist;
            this.absAngle = Math.atan2(this.y - y, this.x - x);
            this.relAngle = this.absAngle - this.parent.absAngle;
            this.updateRelative(false, true);
            if (iter) {
                for (let i = 0; i < this.children.length; i++) {
                    this.children[i].follow(true);
                }
            }
        }
    },

    // Creature class
    Creature: class {
        constructor(x, y, angle, fAccel, fFric, fRes, fThresh, rAccel, rFric, rRes, rThresh) {
            this.x = x;
            this.y = y;
            this.absAngle = angle;
            this.fSpeed = 0;
            this.fAccel = fAccel;
            this.fFric = fFric;
            this.fRes = fRes;
            this.fThresh = fThresh;
            this.rSpeed = 0;
            this.rAccel = rAccel;
            this.rFric = rFric;
            this.rRes = rRes;
            this.rThresh = rThresh;
            this.children = [];
            this.systems = [];
        }

        follow(x, y) {
            const dist = Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2);
            const angle = Math.atan2(y - this.y, x - this.x);
            
            // Update forward
            let accel = this.fAccel;
            if (this.systems.length > 0) {
                let sum = 0;
                for (let i = 0; i < this.systems.length; i++) {
                    sum += this.systems[i].step == 0;
                }
                accel *= sum / this.systems.length;
            }
            this.fSpeed += accel * (dist > this.fThresh);
            this.fSpeed *= 1 - this.fRes;
            this.speed = Math.max(0, this.fSpeed - this.fFric);
            
            // Update rotation
            let dif = this.absAngle - angle;
            dif -= 2 * Math.PI * Math.floor(dif / (2 * Math.PI) + 1 / 2);
            if (Math.abs(dif) > this.rThresh && dist > this.fThresh) {
                this.rSpeed -= this.rAccel * (2 * (dif > 0) - 1);
            }
            this.rSpeed *= 1 - this.rRes;
            if (Math.abs(this.rSpeed) > this.rFric) {
                this.rSpeed -= this.rFric * (2 * (this.rSpeed > 0) - 1);
            } else {
                this.rSpeed = 0;
            }

            // Update position
            this.absAngle += this.rSpeed;
            this.absAngle -= 2 * Math.PI * Math.floor(this.absAngle / (2 * Math.PI) + 1 / 2);
            this.x += this.speed * Math.cos(this.absAngle);
            this.y += this.speed * Math.sin(this.absAngle);
            this.absAngle += Math.PI;
            
            for (let i = 0; i < this.children.length; i++) {
                this.children[i].follow(true, true);
            }
            
            for (let i = 0; i < this.systems.length; i++) {
                this.systems[i].update(x, y);
            }
            
            this.absAngle -= Math.PI;
            this.draw(true);
        }

        draw(iter) {
            const r = 4;
            ComplexReptileCursor.ctx.beginPath();
            ComplexReptileCursor.ctx.arc(
                this.x,
                this.y,
                r,
                Math.PI / 4 + this.absAngle,
                7 * Math.PI / 4 + this.absAngle
            );
            ComplexReptileCursor.ctx.moveTo(
                this.x + r * Math.cos(7 * Math.PI / 4 + this.absAngle),
                this.y + r * Math.sin(7 * Math.PI / 4 + this.absAngle)
            );
            ComplexReptileCursor.ctx.lineTo(
                this.x + r * Math.cos(this.absAngle) * Math.sqrt(2),
                this.y + r * Math.sin(this.absAngle) * Math.sqrt(2)
            );
            ComplexReptileCursor.ctx.lineTo(
                this.x + r * Math.cos(Math.PI / 4 + this.absAngle),
                this.y + r * Math.sin(Math.PI / 4 + this.absAngle)
            );
            ComplexReptileCursor.ctx.stroke();
            
            if (iter) {
                for (let i = 0; i < this.children.length; i++) {
                    this.children[i].draw(true);
                }
            }
        }
    },

    // LimbSystem class
    LimbSystem: class {
        constructor(end, length, speed, creature) {
            this.end = end;
            this.length = Math.max(1, length);
            this.creature = creature;
            this.speed = speed;
            creature.systems.push(this);
            this.nodes = [];
            let node = end;
            for (let i = 0; i < length; i++) {
                this.nodes.unshift(node);
                node = node.parent;
                if (!node.isSegment) {
                    this.length = i + 1;
                    break;
                }
            }
            this.hip = this.nodes[0].parent;
        }

        moveTo(x, y) {
            this.nodes[0].updateRelative(true, true);
            const dist = Math.sqrt((x - this.end.x) ** 2 + (y - this.end.y) ** 2);
            let len = Math.max(0, dist - this.speed);
            for (let i = this.nodes.length - 1; i >= 0; i--) {
                const node = this.nodes[i];
                const ang = Math.atan2(node.y - y, node.x - x);
                node.x = x + len * Math.cos(ang);
                node.y = y + len * Math.sin(ang);
                x = node.x;
                y = node.y;
                len = node.size;
            }
            for (let i = 0; i < this.nodes.length; i++) {
                const node = this.nodes[i];
                node.absAngle = Math.atan2(node.y - node.parent.y, node.x - node.parent.x);
                node.relAngle = node.absAngle - node.parent.absAngle;
                for (let ii = 0; ii < node.children.length; ii++) {
                    const childNode = node.children[ii];
                    if (!this.nodes.includes(childNode)) {
                        childNode.updateRelative(true, false);
                    }
                }
            }
        }

        update() {
            this.moveTo(ComplexReptileCursor.Input.mouse.x, ComplexReptileCursor.Input.mouse.y);
        }
    },

    // LegSystem class
    LegSystem: class {
        constructor(end, length, speed, creature) {
            this.end = end;
            this.length = Math.max(1, length);
            this.creature = creature;
            this.speed = speed;
            creature.systems.push(this);
            this.nodes = [];
            let node = end;
            for (let i = 0; i < length; i++) {
                this.nodes.unshift(node);
                node = node.parent;
                if (!node.isSegment) {
                    this.length = i + 1;
                    break;
                }
            }
            this.hip = this.nodes[0].parent;
            this.goalX = end.x;
            this.goalY = end.y;
            this.step = 0;
            this.forwardness = 0;
            this.reach = 0.9 * Math.sqrt((this.end.x - this.hip.x) ** 2 + (this.end.y - this.hip.y) ** 2);
            let relAngle = this.creature.absAngle - Math.atan2(this.end.y - this.hip.y, this.end.x - this.hip.x);
            relAngle -= 2 * Math.PI * Math.floor(relAngle / 2 / Math.PI + 1 / 2);
            this.swing = -relAngle + (2 * (relAngle < 0) - 1) * Math.PI / 2;
            this.swingOffset = this.creature.absAngle - this.hip.absAngle;
        }

        update(x, y) {
            this.moveTo(this.goalX, this.goalY);
            if (this.step == 0) {
                const dist = Math.sqrt((this.end.x - this.goalX) ** 2 + (this.end.y - this.goalY) ** 2);
                if (dist > 1) {
                    this.step = 1;
                    this.goalX = this.hip.x + this.reach * Math.cos(this.swing + this.hip.absAngle + this.swingOffset) + (2 * Math.random() - 1) * this.reach / 2;
                    this.goalY = this.hip.y + this.reach * Math.sin(this.swing + this.hip.absAngle + this.swingOffset) + (2 * Math.random() - 1) * this.reach / 2;
                }
            } else if (this.step == 1) {
                const theta = Math.atan2(this.end.y - this.hip.y, this.end.x - this.hip.x) - this.hip.absAngle;
                const dist = Math.sqrt((this.end.x - this.hip.x) ** 2 + (this.end.y - this.hip.y) ** 2);
                const forwardness2 = dist * Math.cos(theta);
                const dF = this.forwardness - forwardness2;
                this.forwardness = forwardness2;
                if (dF * dF < 1) {
                    this.step = 0;
                    this.goalX = this.hip.x + (this.end.x - this.hip.x);
                    this.goalY = this.hip.y + (this.end.y - this.hip.y);
                }
            }
        }

        moveTo(x, y) {
            this.nodes[0].updateRelative(true, true);
            const dist = Math.sqrt((x - this.end.x) ** 2 + (y - this.end.y) ** 2);
            let len = Math.max(0, dist - this.speed);
            for (let i = this.nodes.length - 1; i >= 0; i--) {
                const node = this.nodes[i];
                const ang = Math.atan2(node.y - y, node.x - x);
                node.x = x + len * Math.cos(ang);
                node.y = y + len * Math.sin(ang);
                x = node.x;
                y = node.y;
                len = node.size;
            }
            for (let i = 0; i < this.nodes.length; i++) {
                const node = this.nodes[i];
                node.absAngle = Math.atan2(node.y - node.parent.y, node.x - node.parent.x);
                node.relAngle = node.absAngle - node.parent.absAngle;
                for (let ii = 0; ii < node.children.length; ii++) {
                    const childNode = node.children[ii];
                    if (!this.nodes.includes(childNode)) {
                        childNode.updateRelative(true, false);
                    }
                }
            }
        }
    },

    // Setup lizard function
    setupLizard(size, legs, tail) {
        const s = size;
        this.critter = new this.Creature(
            window.innerWidth / 2,
            window.innerHeight / 2,
            0,
            s * 10,
            s * 2,
            0.5,
            16,
            0.5,
            0.085,
            0.5,
            0.3
        );

        let spinal = this.critter;

        // Neck
        for (let i = 0; i < 6; i++) {
            spinal = new this.Segment(spinal, s * 4, 0, Math.PI * 2 / 3, 1.1);
            for (let ii = -1; ii <= 1; ii += 2) {
                let node = new this.Segment(spinal, s * 3, ii, 0.1, 2);
                for (let iii = 0; iii < 3; iii++) {
                    node = new this.Segment(node, s * 0.1, -ii * 0.1, 0.1, 2);
                }
            }
        }

        // Torso and legs
        for (let i = 0; i < legs; i++) {
            if (i > 0) {
                // Vertebrae and ribs
                for (let ii = 0; ii < 6; ii++) {
                    spinal = new this.Segment(spinal, s * 4, 0, 1.571, 1.5);
                    for (let iii = -1; iii <= 1; iii += 2) {
                        let node = new this.Segment(spinal, s * 3, iii * 1.571, 0.1, 1.5);
                        for (let iv = 0; iv < 3; iv++) {
                            node = new this.Segment(node, s * 3, -iii * 0.3, 0.1, 2);
                        }
                    }
                }
            }

            // Legs and shoulders
            for (let ii = -1; ii <= 1; ii += 2) {
                let node = new this.Segment(spinal, s * 12, ii * 0.785, 0, 8); // Hip
                node = new this.Segment(node, s * 16, -ii * 0.785, 6.28, 1); // Humerus
                node = new this.Segment(node, s * 16, ii * 1.571, Math.PI, 2); // Forearm
                for (let iii = 0; iii < 4; iii++) {
                    new this.Segment(node, s * 4, (iii / 3 - 0.5) * 1.571, 0.1, 4);
                }
                new this.LegSystem(node, 3, s * 12, this.critter);
            }
        }

        // Tail
        for (let i = 0; i < tail; i++) {
            spinal = new this.Segment(spinal, s * 4, 0, Math.PI * 2 / 3, 1.1);
            for (let ii = -1; ii <= 1; ii += 2) {
                let node = new this.Segment(spinal, s * 3, ii, 0.1, 2);
                for (let iii = 0; iii < 3; iii++) {
                    node = new this.Segment(node, s * 3 * (tail - i) / tail, -ii * 0.1, 0.1, 2);
                }
            }
        }
    },

    // Handle window resize
    handleResize() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }
};

// Initialize resize handler
window.addEventListener('resize', () => {
    ComplexReptileCursor.handleResize();
});
