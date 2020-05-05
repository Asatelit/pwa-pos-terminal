import { AppActions, AppState } from 'common/types';

export type Context<S> = [S, AppActions];

export type UpdateState = (props: Partial<AppState>) => void;

export type Action<S> = (state: AppState, setState: UpdateState) => S;
