// Toast Notification helper

let toastTimeout = null;

export function showToast(title, description = '', icon = 'check_circle') {
  let container = document.getElementById('luxestay-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'luxestay-toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="material-symbols-outlined toast-icon">${icon}</span>
    <div style="flex: 1;">
      <div class="toast-title">${title}</div>
      ${description ? `<div class="toast-desc">${description}</div>` : ''}
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
