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

        // If nothing below move down
        if (!moveParticle(row, col, newRow, col)) {
            // Try to move left
            if (!moveParticle(row, col, newRow, col - 1, this.swap)) {
                moveParticle(row, col, newRow, col + 1, this.swap)
            }
        }
    }
}

export class Water extends Particle {
    constructor() {
        super();
        this.color = "blue";
        this.type = "water";
    }

    update(row, col) {
        // 👇 Put the following code here 👇
        // Make water turn dirt into grass when it touches it
        if (getParticle(row + 1, col)?.type == "dirt") {
            // Remove water and change dirt to grass
            setParticle(row + 1, col, new Grass());
            setParticle(row, col, null);
            return;
        }
        // 👆 Put the following code here 👆

        // Try to move down
        if (getRandomInt(0, 2) && !getParticle(row + 1, col)) {
            moveParticle(row, col, row + 1, col, this.swap);
        }

        // Move left or right
        if (getRandomInt(0, 1) && !getParticle(row, col + 1)) {
            moveParticle(row, col, row, col + 1, this.swap);
        }
        else if (!getParticle(row, col - 1)) {
            moveParticle(row, col, row, col - 1, this.swap);
        }
    }
}

/**
 * Dirt particle
 */
export class Dirt extends Sand {
    constructor() {
        super(); // Call the constructor of the Sand class
        this.color = "brown";
        this.type = "dirt";
    }
    // No update or swap needed! It inherits from Sand.
}

export class Grass extends Sand {
    constructor() {
        super(); // Call the constructor of the Sand class
        this.color = "green";
        this.type = "grass";
    }
    // No update or swap needed! It inherits from Sand.
}
/**
 * Rock particle
 */
export class Stone extends Particle {
    constructor() {
        super(); // Call the constructor of the Particle class
        this.color = "gray";
        this.type = "stone";
    }
    // No update or swap needed!
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
    } else if (value == "Water") {
        return new Water();
    } else if (value == "Stone") { // Add this
        return new Stone();
    } else if (value == "Dirt") {   // Add this
        return new Dirt();
    }
    return null;
}