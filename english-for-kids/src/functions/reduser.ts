import { Action } from '@reduxjs/toolkit';
import { MODE } from './actions';

export function reducer(state = { value: MODE.TRAIN }, action: Action): { value: MODE } {
  switch (action.type) {
    case MODE.GAME:
      return { value: MODE.GAME };
    case MODE.TRAIN:
      return { value: MODE.TRAIN };
    case MODE.ADMIN:
      return { value: MODE.ADMIN };
    default:
      return state;
  }
}
