export type GlobalModal = 'family' | 'caregiver' | 'get-started' | 'caregiver-apply' | 'guide-download';

export const MODAL_EVENT_NAME = 'open-modal';

export const emitOpenModal = (modal: GlobalModal) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<GlobalModal>(MODAL_EVENT_NAME, { detail: modal }));
};
