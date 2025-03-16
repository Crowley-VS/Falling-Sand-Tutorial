import { checkBounds, moveParticle, getParticle, setParticle } from "./canvas.js";
import { getRandomInt } from "./util.js";

/**
 * Base particle class
 */
class Particle {
    constructor() {
        this.color = "";
        this.type = "";
    }

    /**
     * Returns true if the particle should swap with other when trying
     * to move onto the same grid location as {@link other}.
     * 
     * EX: Let sand sink below water
     * 
     * @param {Particle} other 
     * @returns {boolean} Should the particle swap
     */
    swap(other) {
        return false;
    }

    /**
     * Update the particle at location (row, col)
     * 
     * @param {number} row 
     * @param {number} col 
     */
    update(row, col) {

    }
}

/**
 * Sand particle
 */
export class Sand extends Particle {
    constructor() {
        super();
        this.color = "orange";
        this.type = "sand";
    }

    swap(other) {
        // Make sand fall below water
        return other.type == "water";
    }

    update(row, col) {
        // Fall due to gravity
        let newRow = row + 1;
        // Make sure sand does not fall off screen
        if (!checkBounds(newRow, col)) {
            return;
        }

        // If nothing below move down
        if (!moveParticle(row, col, newRow, col, this.swap)) {
            // Try to move left
            if (!moveParticle(row, col, newRow, col-1, this.swap)) {
                // Move right
                moveParticle(row, col, newRow, col+1, this.swap);
            }
        }
    }
}

/**
 * Water particle
 */
export class Water extends Particle {
    constructor() {
        super();
        this.color = "blue";
        this.type = "water";
    }

    update(row, col) {
        // Make water turn dirt into grass when it touches it
        if (getParticle(row+1, col)?.type == "dirt") {
            // Remove water and change dirt to grass
            setParticle(row+1, col, new Grass());
            setParticle(row, col, null);
            return;
        }

        // Try to move down
        if (getRandomInt(0, 2) && !getParticle(row+1, col)) {
            moveParticle(row, col, row+1, col, super.swap);
        } 
        
        // Move left or right
        if (getRandomInt(0, 1) && !getParticle(row, col+1)) {
            moveParticle(row, col, row, col+1, super.swap);
        }
        else if (!getParticle(row, col-1)) {
            moveParticle(row, col, row, col-1, super.swap);
        }
    }
}

/**
 * Stone particle
 */
export class Stone extends Particle {
    constructor() {
        super();
        this.color = "gray";
        this.type = "stone";
    }
}

/**
 * Dirt particle
 * Inherits from Sand so it acts exactly like it
 */
export class Dirt extends Sand {
    constructor() {
        super();
        this.color = "brown";
        this.type = "dirt";
    }
}

/**
 * Grass particle
 * Inherits from Sand so it acts exactly like it
 */
export class Grass extends Sand {
    constructor() {
        super();
        this.color = "green";
        this.type = "grass";
    }
}

/**
 * Create particle based on dropdown name
 * 
 * @param {string} value 
 * @returns 
 */
export function checkParticleType(value) {
    if (value == "Sand") {
        return new Sand();
    } 
    else if (value == "Water") {
        return new Water();
    }  
    else if (value == "Stone") {
        return new Stone();
    }   
    else if (value == "Dirt") {
        return new Dirt();
    }    
    else if (value == "Grass") {
        return new Grass();
    } 
}