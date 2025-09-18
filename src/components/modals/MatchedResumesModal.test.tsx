import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MatchedResumesModal } from "./MatchedResumesModal";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchAnalysesByRequisition, fetchAnalysisSummary, deleteAnalysis } from "../../features/resumeAnalysis/resumeAnalysisSlice";

// Mock redux hooks and actions
jest.mock("../../hooks/redux", () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock("../../features/resumeAnalysis/resumeAnalysisSlice", () => ({
  fetchAnalysesByRequisition: jest.fn(),
  fetchAnalysisSummary: jest.fn(),
  deleteAnalysis: jest.fn(),
}));

describe("MatchedResumesModal", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    jest.clearAllMocks();
  });

  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    jobId: "1",
  };

  it("renders loading state when isLoading is true", () => {
    (useAppSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        resumeAnalysis: {
          byRequisition: {},
          isLoading: true,
          summaryByRequisition: {},
        },
      })
    );

    render(<MatchedResumesModal {...defaultProps} />);
    expect(screen.getByText(/Loading matched resumes/i)).toBeInTheDocument();
  });

  it("renders empty state when there are no matched resumes", () => {
    (useAppSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        resumeAnalysis: {
          byRequisition: { 1: [] },
          isLoading: false,
          summaryByRequisition: {},
        },
      })
    );

    render(<MatchedResumesModal {...defaultProps} />);
    expect(screen.getByText(/No Matched Resumes/i)).toBeInTheDocument();
  });

  it("renders resumes when analyses exist", () => {
    (useAppSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        resumeAnalysis: {
          byRequisition: {
            1: [
              {
                id: 101,
                candidate_name: "John Doe",
                resume_filename: "resume.pdf",
                created_at: "2023-09-18T10:00:00Z",
                is_match: "match",
                match_percentage: 85,
              },
            ],
          },
          isLoading: false,
          summaryByRequisition: {
            1: {
              total_candidates: 1,
              matches: 1,
              partial_matches: 0,
              not_matches: 0,
              average_match_percentage: 85,
            },
          },
        },
      })
    );

    render(<MatchedResumesModal {...defaultProps} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText(/resume.pdf/i)).toBeInTheDocument();
    expect(screen.getByText(/85%/i)).toBeInTheDocument();
    expect(screen.getByText(/Excellent Match/i)).toBeInTheDocument();
  });

  it("calls deleteAnalysis when Delete button is clicked", () => {
    (useAppSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        resumeAnalysis: {
          byRequisition: {
            1: [
              {
                id: 101,
                candidate_name: "John Doe",
                resume_filename: "resume.pdf",
                created_at: "2023-09-18T10:00:00Z",
                is_match: "match",
                match_percentage: 70,
              },
            ],
          },
          isLoading: false,
          summaryByRequisition: {},
        },
      })
    );

    render(<MatchedResumesModal {...defaultProps} />);

    const deleteButton = screen.getByText(/Delete/i);
    fireEvent.click(deleteButton);

    expect(mockDispatch).toHaveBeenCalledWith(deleteAnalysis(101));
  });

  it("calls onClose when Close button is clicked", () => {
    (useAppSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        resumeAnalysis: {
          byRequisition: { 1: [] },
          isLoading: false,
          summaryByRequisition: {},
        },
      })
    );

    render(<MatchedResumesModal {...defaultProps} />);

    const closeButton = screen.getByText(/Close/i);
    fireEvent.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
