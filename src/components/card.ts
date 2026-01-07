/* src/components/card.ts */

interface CardProps {
  title: string;
  description?: string;
  badge?: string;
  onClick?: () => void;
  icon?: string;
  code?: string;
  teacher?: string;
}

export function createCard({ title, description, onClick, icon, code, teacher }: CardProps): HTMLElement {
  const card = document.createElement('div');
  card.className = 'card';

  card.innerHTML = `
    <div class="card-icon">
      ${getIconEmoji(icon || '')}
    </div>
    <div class="card-title">${title}</div>
    <div class="card-subtitle">${code || ''} ${teacher ? `• Prof. ${teacher}` : ''}</div>
    <div class="card-text">${description || ''}</div>
    <div class="card-footer">
      Explore Syllabus →
    </div>
  `;

  if (onClick) {
    card.addEventListener('click', onClick);
  }

  return card;
}

function getIconEmoji(iconName: string): string {
  const icons: Record<string, string> = {
    'bi-truck': '🚚',
    'bi-robot': '🤖',
    'bi-megaphone': '📢',
    'bi-graph-up': '📊',
    'bi-crystal-ball': '🔮',
    'bi-book': '📚',
    'bi-tools': '🛠️'
  };
  return icons[iconName] || '📄';
}
