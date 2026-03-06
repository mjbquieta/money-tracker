import { driver, type DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';

const ONBOARDING_KEY = 'prospera-onboarding-completed';

export function useOnboarding() {
  const hasCompleted = ref(false);

  function checkCompleted(): boolean {
    if (import.meta.server) return true;
    return localStorage.getItem(ONBOARDING_KEY) === 'true';
  }

  function markCompleted() {
    if (import.meta.server) return;
    localStorage.setItem(ONBOARDING_KEY, 'true');
    hasCompleted.value = true;
  }

  function resetOnboarding() {
    if (import.meta.server) return;
    localStorage.removeItem(ONBOARDING_KEY);
    hasCompleted.value = false;
  }

  function startTour() {
    const steps: DriveStep[] = [
      {
        popover: {
          title: 'Welcome to Prospera!',
          description:
            'Your personal finance companion. Let us show you around so you can start managing your money with confidence.',
        },
      },
      {
        element: '[data-tour="dashboard"]',
        popover: {
          title: 'Dashboard',
          description:
            'Your financial overview at a glance. See your income, expenses, savings rate, and spending trends.',
          side: 'bottom',
        },
      },
      {
        element: '[data-tour="budget-periods"]',
        popover: {
          title: 'Budget Periods',
          description:
            'Organize your finances by time periods. Create monthly or custom budget periods to track spending.',
          side: 'bottom',
        },
      },
      {
        element: '[data-tour="personal-budgets"]',
        popover: {
          title: 'Personal Budgets',
          description:
            'Set up personal budget plans with line items to plan your spending ahead of time.',
          side: 'bottom',
        },
      },
      {
        element: '[data-tour="goals"]',
        popover: {
          title: 'Financial Goals',
          description:
            'Set savings goals and track your progress with contributions over time.',
          side: 'bottom',
        },
      },
      {
        element: '[data-tour="debts"]',
        popover: {
          title: 'Debt Tracker',
          description:
            'Keep track of money you owe and money owed to you. Record payments and auto-settle when fully paid.',
          side: 'bottom',
        },
      },
      {
        element: '[data-tour="notifications"]',
        popover: {
          title: 'Notifications',
          description:
            'Stay informed about budget alerts, goal milestones, and upcoming debt due dates.',
          side: 'bottom',
        },
      },
      {
        element: '[data-tour="theme-toggle"]',
        popover: {
          title: 'Theme Toggle',
          description:
            'Switch between light and dark mode to suit your preference.',
          side: 'bottom',
        },
      },
      {
        element: '[data-tour="keyboard-shortcuts"]',
        popover: {
          title: 'Keyboard Shortcuts',
          description:
            'Press Ctrl+K (or Cmd+K on Mac) to open the command palette for quick navigation. Press ? to see all shortcuts.',
          side: 'bottom',
        },
      },
      {
        popover: {
          title: 'You\'re all set!',
          description:
            'Start by creating a budget period and adding your income and expenses. You can restart this tour anytime from Settings.',
        },
      },
    ];

    const driverObj = driver({
      showProgress: true,
      animate: true,
      smoothScroll: true,
      allowClose: true,
      popoverClass: 'prospera-tour',
      steps,
      onDestroyed: () => {
        markCompleted();
      },
    });

    driverObj.drive();
  }

  onMounted(() => {
    hasCompleted.value = checkCompleted();
  });

  return {
    hasCompleted,
    startTour,
    resetOnboarding,
    checkCompleted,
  };
}
