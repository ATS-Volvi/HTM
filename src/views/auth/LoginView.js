// ==========================================================================
// VOLVITECH HOSPITALITY OS — ENTERPRISE LOGIN VIEW
// Screen 1: Single Sign-On & Role-Based Authentication
// ==========================================================================
import { store } from '../../state/store.js';
import { authClient } from '../../api/authClient.js';
import { Toast } from '../../components/Toast.js';

export class LoginView {
  constructor() {
    this.container = null;
    this.isLoading = false;
    this.demoUsers = [];
  }

  async loadDemoUsers() {
    try {
      const res = await authClient.getDemoUsers();
      this.demoUsers = res.data || [];
    } catch (e) {
      console.warn('Could not fetch demo users from backend, using fallback list:', e);
      this.demoUsers = [
        { username: 'reception', full_name: 'Julian Croft (Front Desk)', role_name: 'Front Desk Agent', avatar_initials: 'JC' },
        { username: 'gm', full_name: 'Victoria Sterling (General Manager)', role_name: 'General Manager', avatar_initials: 'VS' },
        { username: 'admin', full_name: 'Alexander Vance (System Admin)', role_name: 'System Administrator', avatar_initials: 'AV' },
        { username: 'store', full_name: 'Marcus Aurel (Supply Manager)', role_name: 'Supply & Store Manager', avatar_initials: 'MA' },
        { username: 'chef', full_name: 'Antoine Laurent (Executive Chef)', role_name: 'Executive Chef / F&B', avatar_initials: 'AL' },
        { username: 'housekeeping', full_name: 'Maria Santos (Housekeeping)', role_name: 'Housekeeping Supervisor', avatar_initials: 'MS' },
      ];
    }
  }

  render() {
    const el = document.createElement('div');
    el.className = 'min-h-screen bg-surface-bright flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden';
    this.container = el;

    this.renderContent();
    this.loadDemoUsers().then(() => this.renderContent());
    return el;
  }

  renderContent() {
    if (!this.container) return;

    this.container.innerHTML = `
      <!-- Background subtle architectural grid -->
      <div class="absolute inset-0 bg-[radial-gradient(#c4c6cf_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none"></div>

      <div class="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl p-8 sm:p-10 relative z-10 animate-fadeIn">
        
        <!-- Header Monogram & Brand -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-on-primary font-bold text-2xl shadow-md mb-4 border border-outline-variant">
            V
          </div>
          <h1 class="font-headline-lg text-2xl font-bold text-primary tracking-tight">VOLVITECH</h1>
          <p class="font-label-caps text-xs text-secondary tracking-widest font-bold uppercase mt-0.5">HOSPITALITY OS</p>
          <div class="inline-block mt-3 px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant text-[11px] font-data-mono text-on-surface-variant font-medium">
            Central Hotel Management System
          </div>
        </div>

        <!-- Login Form -->
        <form id="form-login" class="space-y-4">
          <div>
            <label class="block font-label-caps text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5" for="login-username">
              Username or Staff ID
            </label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">badge</span>
              <input 
                id="login-username" 
                type="text" 
                required 
                value="reception"
                placeholder="e.g. reception, gm, admin" 
                class="w-full pl-10 pr-4 py-2.5 bg-surface-bright border border-outline-variant rounded-lg text-xs font-body-sm text-on-surface focus:outline-none focus:border-primary transition-colors h-10"
              />
            </div>
          </div>

          <div>
            <label class="block font-label-caps text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5" for="login-password">
              Password
            </label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">lock</span>
              <input 
                id="login-password" 
                type="password" 
                required 
                value="password123" 
                placeholder="••••••••" 
                class="w-full pl-10 pr-4 py-2.5 bg-surface-bright border border-outline-variant rounded-lg text-xs font-body-sm text-on-surface focus:outline-none focus:border-primary transition-colors h-10"
              />
            </div>
          </div>

          <div class="flex items-center justify-between text-[11px] text-on-surface-variant pt-1">
            <label class="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked class="rounded border-outline-variant text-primary focus:ring-0" />
              <span>Remember station</span>
            </label>
            <span class="font-data-mono text-primary font-semibold">Terminal 01</span>
          </div>

          <button 
            type="submit" 
            id="btn-submit-login" 
            ${this.isLoading ? 'disabled' : ''}
            class="w-full bg-primary text-on-primary py-2.5 rounded-lg text-xs font-label-caps font-bold hover:bg-primary-container transition-all shadow-md flex items-center justify-center gap-2 h-10 mt-2"
          >
            ${
              this.isLoading
                ? `<span class="material-symbols-outlined animate-spin text-[18px]">sync</span> Authenticating...`
                : `<span class="material-symbols-outlined text-[18px]">login</span> Sign In to Hotel OS`
            }
          </button>
        </form>

        <!-- 1-Click Role Switcher Demo Personas -->
        <div class="mt-8 pt-6 border-t border-outline-variant">
          <p class="text-[11px] font-label-caps font-bold text-on-surface-variant uppercase tracking-wider text-center mb-3">
            Quick Persona Login (Demo Roles)
          </p>
          <div class="grid grid-cols-2 gap-2">
            ${this.demoUsers.map((u) => `
              <button 
                type="button" 
                class="btn-demo-persona flex items-center gap-2 p-2 rounded-lg border border-outline-variant hover:bg-surface-container hover:border-primary/50 transition-all text-left group bg-surface-bright"
                data-username="${u.username}"
              >
                <div class="w-7 h-7 rounded-md bg-primary-fixed text-primary font-data-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                  ${u.avatar_initials || u.avatarInitials || 'US'}
                </div>
                <div class="min-w-0">
                  <div class="text-[11px] font-bold text-primary truncate leading-tight">${u.username}</div>
                  <div class="text-[10px] text-on-surface-variant truncate">${u.role_name || u.roleName}</div>
                </div>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Footer Notice -->
        <div class="mt-6 text-center text-[10px] font-data-mono text-on-surface-variant">
          Protected by Volvitech Enterprise Security • Single Source of Truth
        </div>

      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const form = this.container.querySelector('#form-login');
    if (form) {
      form.onsubmit = async (e) => {
        e.preventDefault();
        const username = this.container.querySelector('#login-username').value;
        const password = this.container.querySelector('#login-password').value;
        await this.handleLogin(username, password);
      };
    }

    this.container.querySelectorAll('.btn-demo-persona').forEach((btn) => {
      btn.onclick = async () => {
        const username = btn.dataset.username;
        const userInput = this.container.querySelector('#login-username');
        if (userInput) userInput.value = username;
        await this.handleLogin(username, 'password123');
      };
    });
  }

  async handleLogin(username, password) {
    this.isLoading = true;
    this.renderContent();

    try {
      const res = await authClient.login(username, password);
      if (res.success && res.data) {
        const cleanName = res.data.user.fullName.replace(/\s*\(.*?\)\s*/g, '').trim();
        Toast.show({
          title: 'Welcome back',
          message: `Authenticated as ${cleanName} • ${res.data.user.roleName}`,
          type: 'success',
        });
        store.loginUser(res.data);
      } else {
        throw new Error(res.error || 'Authentication failed');
      }
    } catch (err) {
      console.error('[LoginView error]', err);
      Toast.show({
        title: 'Authentication Error',
        message: err.message || 'Could not verify credentials. Please try again.',
        type: 'error',
      });
      this.isLoading = false;
      this.renderContent();
    }
  }
}
