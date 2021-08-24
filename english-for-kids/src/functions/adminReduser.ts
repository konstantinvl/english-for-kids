import { Action } from '@reduxjs/toolkit';
import { ADMINMODE } from './actions';

export function adminReducer(state = { value: ADMINMODE.OUT }, action: Action): { value: ADMINMODE } {
  switch (action.type) {
    case ADMINMODE.IN:
      return { value: ADMINMODE.IN };
    case ADMINMODE.OUT:
      return { value: ADMINMODE.OUT };
    default:
      return state;
  }
}
