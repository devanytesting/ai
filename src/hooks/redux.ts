// Typed Redux hooks for dispatch and selector
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

// Use throughout the app instead of plain `useDispatch`
export const useAppDispatch = () => useDispatch<AppDispatch>();
// Typed selector to get strongly-typed state
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;