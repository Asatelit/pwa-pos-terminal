import { SettingsActions, Action } from 'common/types';

const settingsActions: Action<SettingsActions> = (state, updateState) => ({
    update: settings => updateState({ settings: {...state.settings, ...settings } }),
});

export default settingsActions;
