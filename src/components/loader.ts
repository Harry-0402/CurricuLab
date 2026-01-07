/* src/components/loader.ts */

export function createLoader(): HTMLElement {
    const loader = document.createElement('div');
    loader.className = 'loader';
    return loader;
}
