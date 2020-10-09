import { SettingsActions, Action } from 'common/types';

export const createSettingsActions: Action<SettingsActions> = (state, updateState) => ({
    update: settings => updateState({ settings: {...state.settings, ...settings } }),
});
