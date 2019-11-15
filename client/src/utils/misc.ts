import { Color } from './color';
import { DOMRenderer } from './dom-renderer';

export const getPixelData = (imageData: ImageData, x: number, y: number): Color => {
    const pixelIndex: number = Math.round((y * imageData.width + x) * 4);
    return new Color(
        imageData.data[pixelIndex + 0],
        imageData.data[pixelIndex + 1],
        imageData.data[pixelIndex + 2],
        imageData.data[pixelIndex + 3]);
};

const setPixelData = (array: number[], color: Color, positions: number[][], width: number, height: number): void => {
    for (const pos of positions) {
        const pixelIndex: number = Math.round((pos[1] * width + pos[0]) * 4);
        array[pixelIndex + 0] = color.red;
        array[pixelIndex + 1] = color.green;
        array[pixelIndex + 2] = color.blue;
        array[pixelIndex + 3] = 255;
    }
};

export const generateImageData = (positions: number[][], color: Color, width: number, height: number): string => {
    const array: number[] = createArray(width, height);

    setPixelData(array, color, positions, width, height);

    const uint8Array = Uint8ClampedArray.from(array);
    const image: ImageData = new ImageData(uint8Array, width, height);

    const canvas = DOMRenderer.createElement('canvas');

    DOMRenderer.setAttribute(canvas, 'width',
        width.toString());
    DOMRenderer.setAttribute(canvas, 'height',
        height.toString());

    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    ctx.putImageData(image, 0, 0);
    return canvas.toDataURL();
};

const createArray = (width: number, height: number): number[] => {
    const iterableNumberArray: number[] = [];

    const size: number = width * height * 4;
    for (let i = 0; i < size; i++) {
        iterableNumberArray.push(0);
    }
    return iterableNumberArray;
};
