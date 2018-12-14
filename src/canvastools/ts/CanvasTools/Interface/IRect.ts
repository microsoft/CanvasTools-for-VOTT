/**
 * Interface to implement anything that has width and size, and can generate a snapshot of its size.
 */
export interface IRect {
    /**
     * Rect width
     */
    width: number;

    /**
     * Rect height
     */
    height: number;
    
    /**
     * Resize the rect to specified width and height
     * @param width New rect width
     * @param height New rect height
     */
    resize(width: number, height: number): void;

    /**
     * Generate a copy of the rect
     * @returns A new rect of the same size
     */
    copy(): IRect;
}