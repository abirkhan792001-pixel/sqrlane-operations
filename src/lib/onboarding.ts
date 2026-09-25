export type OnboardingState = {
  scenario: boolean;
  connection: boolean;
  run: boolean;
  decision: boolean;
  change: boolean;
  dismissed: boolean;
};

const KEY = "sqrlane.onboarding";
const EMPTY: OnboardingState = { scenario:false, connection:false, run:false, decision:false, change:false, dismissed:false };

export function loadOnboarding(): OnboardingState {
  try { return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") }; } catch { return { ...EMPTY }; }
}
export function updateOnboarding(patch: Partial<OnboardingState>) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...loadOnboarding(), ...patch }));
    window.dispatchEvent(new Event("sqrlane-onboarding"));
  } catch { /* storage unavailable */ }
}
export function markOnboarding(step: keyof Omit<OnboardingState,"dismissed">) { updateOnboarding({ [step]:true }); }
