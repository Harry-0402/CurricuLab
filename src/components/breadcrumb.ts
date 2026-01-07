/* src/components/breadcrumb.ts */

interface BreadcrumbItem {
    label: string;
    link?: string;
}

export function createBreadcrumb(items: BreadcrumbItem[]): HTMLElement {
    const nav = document.createElement('nav');
    nav.className = 'breadcrumb';

    nav.innerHTML = items.map((item, index) => {
        const isLast = index === items.length - 1;
        if (isLast) {
            return `<span>${item.label}</span>`;
        }
        return `<a href="#${item.link || '/'}" data-link>${item.label}</a> <span class="separator">/</span>`;
    }).join(' ');

    return nav;
}
