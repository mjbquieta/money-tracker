<script setup lang="ts">
import {
  ShieldCheckIcon,
  ShieldExclamationIcon,
  ClipboardDocumentIcon,
  CheckIcon,
} from '@heroicons/vue/24/outline';
import type {
  TwoFactorSetupResponse,
  TwoFactorVerifyResponse,
  BackupCodesResponse,
} from '~/types';

const api = useApi();

// State
const is2FAEnabled = ref(false);
const step = ref<'idle' | 'qr' | 'verify' | 'backup' | 'disable'>('idle');
const loading = ref(false);
const error = ref<string | null>(null);

// Setup data
const setupData = ref<TwoFactorSetupResponse | null>(null);
const verifyCode = ref('');
const backupCodes = ref<string[]>([]);
const copiedCodes = ref(false);

// Disable form
const disablePassword = ref('');
const disableCode = ref('');

// Check 2FA status
async function checkStatus() {
  // We can infer from the user object — if isTwoFactorEnabled is present
  // For now, try to generate backup codes — if it fails with "not enabled", it's off
  // Simpler: just try the setup endpoint
  const { data } = await api.post<TwoFactorSetupResponse>('/api/v1/auth/2fa/setup', {});
  if (data) {
    // Setup was initiated — 2FA is not enabled
    setupData.value = data;
    step.value = 'qr';
    is2FAEnabled.value = false;
  }
}

async function startSetup() {
  loading.value = true;
  error.value = null;

  const { data, error: apiError } = await api.post<TwoFactorSetupResponse>(
    '/api/v1/auth/2fa/setup',
    {},
  );

  loading.value = false;

  if (apiError) {
    if (
      typeof apiError.message === 'string' &&
      apiError.message.includes('already enabled')
    ) {
      is2FAEnabled.value = true;
      return;
    }
    error.value =
      typeof apiError.message === 'string'
        ? apiError.message
        : apiError.message[0];
    return;
  }

  if (data) {
    setupData.value = data;
    step.value = 'qr';
  }
}

async function verifySetup() {
  if (!verifyCode.value.trim()) return;

  loading.value = true;
  error.value = null;

  const { data, error: apiError } = await api.post<TwoFactorVerifyResponse>(
    '/api/v1/auth/2fa/verify',
    { code: verifyCode.value.trim() },
  );

  loading.value = false;

  if (apiError) {
    error.value =
      typeof apiError.message === 'string'
        ? apiError.message
        : apiError.message[0];
    return;
  }

  if (data) {
    is2FAEnabled.value = true;
    backupCodes.value = data.backupCodes;
    step.value = 'backup';
  }
}

async function handleDisable() {
  if (!disablePassword.value || !disableCode.value) return;

  loading.value = true;
  error.value = null;

  const { error: apiError } = await api.post('/api/v1/auth/2fa/disable', {
    password: disablePassword.value,
    code: disableCode.value,
  });

  loading.value = false;

  if (apiError) {
    error.value =
      typeof apiError.message === 'string'
        ? apiError.message
        : apiError.message[0];
    return;
  }

  is2FAEnabled.value = false;
  step.value = 'idle';
  disablePassword.value = '';
  disableCode.value = '';
}

async function regenerateBackupCodes() {
  loading.value = true;
  error.value = null;

  const { data, error: apiError } = await api.get<BackupCodesResponse>(
    '/api/v1/auth/2fa/backup-codes',
  );

  loading.value = false;

  if (apiError) {
    error.value =
      typeof apiError.message === 'string'
        ? apiError.message
        : apiError.message[0];
    return;
  }

  if (data) {
    backupCodes.value = data.backupCodes;
    step.value = 'backup';
  }
}

function copyBackupCodes() {
  const text = backupCodes.value.join('\n');
  navigator.clipboard.writeText(text);
  copiedCodes.value = true;
  setTimeout(() => {
    copiedCodes.value = false;
  }, 2000);
}

function finishSetup() {
  step.value = 'idle';
  backupCodes.value = [];
  setupData.value = null;
  verifyCode.value = '';
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-lg flex items-center justify-center"
          :class="
            is2FAEnabled
              ? 'bg-green-50 dark:bg-green-900/30'
              : 'bg-secondary-100 dark:bg-secondary-700'
          "
        >
          <ShieldCheckIcon
            v-if="is2FAEnabled"
            class="w-5 h-5 text-green-600 dark:text-green-400"
          />
          <ShieldExclamationIcon
            v-else
            class="w-5 h-5 text-secondary-500 dark:text-secondary-400"
          />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
            Two-Factor Authentication
          </h3>
          <p class="text-sm text-secondary-500 dark:text-secondary-400">
            {{
              is2FAEnabled
                ? 'Your account is protected with 2FA'
                : 'Add an extra layer of security'
            }}
          </p>
        </div>
      </div>

      <span
        v-if="is2FAEnabled"
        class="px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full"
      >
        Enabled
      </span>
    </div>

    <UiBaseAlert v-if="error" type="error" :message="error" class="mb-4" />

    <!-- Idle State: Not Enabled -->
    <div v-if="step === 'idle' && !is2FAEnabled">
      <button
        class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium disabled:opacity-50"
        :disabled="loading"
        @click="startSetup"
      >
        <span
          v-if="loading"
          class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
        ></span>
        Enable Two-Factor Authentication
      </button>
    </div>

    <!-- Idle State: Enabled -->
    <div v-if="step === 'idle' && is2FAEnabled" class="flex gap-3">
      <button
        class="px-4 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 border border-primary-200 dark:border-primary-700 rounded-lg transition-colors font-medium"
        @click="regenerateBackupCodes"
      >
        Regenerate Backup Codes
      </button>
      <button
        class="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg transition-colors font-medium"
        @click="step = 'disable'"
      >
        Disable 2FA
      </button>
    </div>

    <!-- Step 1: QR Code -->
    <div v-if="step === 'qr' && setupData" class="space-y-4">
      <p class="text-sm text-secondary-600 dark:text-secondary-300">
        Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.):
      </p>
      <div class="flex justify-center">
        <div class="p-4 bg-white rounded-xl inline-block">
          <img
            :src="setupData.qrCodeDataUrl"
            alt="2FA QR Code"
            class="w-48 h-48"
          />
        </div>
      </div>
      <div class="text-center">
        <p class="text-xs text-secondary-500 dark:text-secondary-400 mb-1">
          Or enter this key manually:
        </p>
        <code
          class="text-sm font-mono bg-secondary-100 dark:bg-secondary-700 px-3 py-1.5 rounded-lg text-secondary-900 dark:text-secondary-100 select-all"
        >
          {{ setupData.secret }}
        </code>
      </div>
      <div class="flex justify-center pt-2">
        <button
          class="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all font-medium"
          @click="step = 'verify'"
        >
          I've scanned the code
        </button>
      </div>
    </div>

    <!-- Step 2: Verify -->
    <div v-if="step === 'verify'" class="space-y-4">
      <p class="text-sm text-secondary-600 dark:text-secondary-300">
        Enter the 6-digit code from your authenticator app to confirm setup:
      </p>
      <input
        v-model="verifyCode"
        type="text"
        placeholder="000000"
        maxlength="6"
        autocomplete="one-time-code"
        class="w-full px-4 py-3 border border-secondary-200 dark:border-secondary-600 rounded-xl bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 text-center text-2xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        @keyup.enter="verifySetup"
      />
      <div class="flex gap-3">
        <button
          class="flex-1 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all font-medium disabled:opacity-50"
          :disabled="loading || verifyCode.length !== 6"
          @click="verifySetup"
        >
          <span
            v-if="loading"
            class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block mr-2"
          ></span>
          Verify & Enable
        </button>
        <button
          class="px-4 py-2.5 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 border border-secondary-200 dark:border-secondary-600 rounded-lg transition-colors font-medium"
          @click="step = 'qr'"
        >
          Back
        </button>
      </div>
    </div>

    <!-- Step 3: Backup Codes -->
    <div v-if="step === 'backup'" class="space-y-4">
      <div
        class="p-4 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-700 rounded-xl"
      >
        <p class="text-sm font-medium text-warning-700 dark:text-warning-400">
          Save these backup codes in a safe place. Each code can only be used once.
        </p>
      </div>
      <div
        class="grid grid-cols-2 gap-2 p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-xl font-mono text-sm"
      >
        <div
          v-for="(bcode, index) in backupCodes"
          :key="index"
          class="px-3 py-1.5 bg-white dark:bg-secondary-600 rounded text-center text-secondary-900 dark:text-secondary-100"
        >
          {{ bcode }}
        </div>
      </div>
      <div class="flex gap-3">
        <button
          class="flex items-center gap-2 px-4 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 border border-primary-200 dark:border-primary-700 rounded-lg transition-colors font-medium"
          @click="copyBackupCodes"
        >
          <CheckIcon v-if="copiedCodes" class="w-4 h-4 text-green-500" />
          <ClipboardDocumentIcon v-else class="w-4 h-4" />
          {{ copiedCodes ? 'Copied!' : 'Copy All' }}
        </button>
        <button
          class="flex-1 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all font-medium"
          @click="finishSetup"
        >
          I've saved my codes
        </button>
      </div>
    </div>

    <!-- Disable 2FA Form -->
    <div v-if="step === 'disable'" class="space-y-4">
      <p class="text-sm text-secondary-600 dark:text-secondary-300">
        Enter your password and a 2FA code to disable two-factor authentication:
      </p>
      <div>
        <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
          Password
        </label>
        <input
          v-model="disablePassword"
          type="password"
          placeholder="Enter your password"
          class="w-full px-4 py-2.5 border border-secondary-200 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
          2FA Code
        </label>
        <input
          v-model="disableCode"
          type="text"
          placeholder="000000"
          maxlength="6"
          autocomplete="one-time-code"
          class="w-full px-4 py-2.5 border border-secondary-200 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
      <div class="flex gap-3">
        <button
          class="flex-1 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all font-medium disabled:opacity-50"
          :disabled="loading || !disablePassword || disableCode.length !== 6"
          @click="handleDisable"
        >
          <span
            v-if="loading"
            class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block mr-2"
          ></span>
          Disable 2FA
        </button>
        <button
          class="px-4 py-2.5 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 border border-secondary-200 dark:border-secondary-600 rounded-lg transition-colors font-medium"
          @click="
            step = 'idle';
            disablePassword = '';
            disableCode = '';
            error = null;
          "
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>
