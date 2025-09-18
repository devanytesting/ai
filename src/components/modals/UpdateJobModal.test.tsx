import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UpdateJobModal } from './UpdateJobModal';

// Mock hooks and redux
jest.mock('../../hooks/redux', () => ({
  useAppDispatch: () => jest.fn(),
}));
jest.mock('../../features/jobs/jobsSlice', () => ({
  updateJob: jest.fn(),
}));

const mockDispatch = jest.fn(() => Promise.resolve());
const mockOnClose = jest.fn();

const mockJob = {
  id: '1',
  title: 'Backend Developer',
  department: 'Engineering',
  location: 'Remote',
  experience: 2,
  salary_range_min: 50000,
  salary_range_max: 90000,
  employment_type: 'Full-time',
  responsibilities: 'Build APIs',
  qualifications: '2+ years experience',
  skills: ['Node.js', 'Express'],
};

import * as reduxHooks from '../../hooks/redux';

describe('UpdateJobModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch as jest.Mock);
  });

  it('renders modal with job data', () => {
    render(
      <UpdateJobModal job={mockJob} isOpen={true} onClose={mockOnClose} />
    );
    expect(screen.getByDisplayValue(/Backend Developer/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Engineering/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Remote/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    expect(screen.getByDisplayValue('50000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('90000')).toBeInTheDocument();
    expect(screen.getByText(/Node.js/i)).toBeInTheDocument();
    expect(screen.getByText(/Express/i)).toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', () => {
    render(
      <UpdateJobModal job={mockJob} isOpen={true} onClose={mockOnClose} />
    );
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('adds a skill when Enter is pressed', () => {
    render(
      <UpdateJobModal job={mockJob} isOpen={true} onClose={mockOnClose} />
    );
    const skillInput = screen.getByPlaceholderText(/Type a skill and press Enter/i);
    fireEvent.change(skillInput, { target: { value: 'TypeScript' } });
    fireEvent.keyPress(skillInput, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(screen.getByText(/TypeScript/i)).toBeInTheDocument();
  });

  it('removes a skill when remove button is clicked', () => {
    render(
      <UpdateJobModal job={mockJob} isOpen={true} onClose={mockOnClose} />
    );
    const removeButtons = screen.getAllByRole('button', { name: '' });
    fireEvent.click(removeButtons[0]);
    expect(screen.queryByText(/Node.js/i)).not.toBeInTheDocument();
  });

  it('shows alert if required fields are missing on submit', () => {
    window.alert = jest.fn();
    render(
      <UpdateJobModal job={mockJob} isOpen={true} onClose={mockOnClose} />
    );
    // Clear a required field
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: '' } });
    fireEvent.click(screen.getByText(/Update Job Post/i));
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Please fill the title field.'));
  });

  it('shows alert if no skills are present on submit', () => {
    window.alert = jest.fn();
    render(
      <UpdateJobModal job={{ ...mockJob, skills: [] }} isOpen={true} onClose={mockOnClose} />
    );
    // Remove all skills
    const removeButtons = screen.getAllByRole('button', { name: '' });
    removeButtons.forEach(btn => fireEvent.click(btn));
    fireEvent.click(screen.getByText(/Update Job Post/i));
    expect(window.alert).toHaveBeenCalledWith('Please add at least one skill.');
  });

  it('dispatches updateJob and calls onClose on valid submit', async () => {
    render(
      <UpdateJobModal job={mockJob} isOpen={true} onClose={mockOnClose} />
    );
    fireEvent.click(screen.getByText(/Update Job Post/i));
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('does not submit if job is null', () => {
    render(
      <UpdateJobModal job={null} isOpen={true} onClose={mockOnClose} />
    );
    fireEvent.click(screen.getByText(/Update Job Post/i));
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});