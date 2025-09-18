// __tests__/UploadResumesModal.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { UploadResumesModal } from "./UploadResumesModal"; // adjust path if needed
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { clearUploadProgress } from "../../features/resumes/resumesSlice";
import {
  analyzeResumesBulk,
  analyzeResumeSingle,
} from "../../features/resumeAnalysis/resumeAnalysisSlice";

// Mock hooks
jest.mock("../../hooks/redux", () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock("../../features/resumes/resumesSlice", () => ({
  clearUploadProgress: jest.fn(),
}));

jest.mock("../../features/resumeAnalysis/resumeAnalysisSlice", () => ({
  analyzeResumesBulk: jest.fn(),
  analyzeResumeSingle: jest.fn(),
}));

jest.mock("../ui/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe("UploadResumesModal", () => {
  const mockDispatch = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useAppSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        resumes: { uploadProgress: [] },
        resumeAnalysis: { isLoading: false },
      })
    );
    jest.clearAllMocks();
  });

  const setup = (props = {}) =>
    render(
      <UploadResumesModal
        isOpen={true}
        onClose={mockOnClose}
        jobId="123"
        {...props}
      />
    );

  it("renders modal content", () => {
    setup();
    expect(screen.getByText(/Upload Resumes/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Supported formats: PDF, DOC, DOCX/i)
    ).toBeInTheDocument();
  });

  it("calls dispatch and analyzeResumeSingle when one file is dropped", async () => {
    const mockFile = new File(["resume"], "resume.pdf", {
      type: "application/pdf",
    });

    (analyzeResumeSingle as unknown as jest.Mock).mockReturnValue({
      unwrap: () => Promise.resolve(),
    });

    setup();

    // Simulate file drop
    const dropzone = screen.getByText(/Upload Resume Files/i).parentElement!;
    fireEvent.drop(dropzone, {
      dataTransfer: { files: [mockFile] },
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(analyzeResumeSingle).toHaveBeenCalledWith({
        requisitionId: 123,
        file: mockFile,
      });
    });
  });

  it("calls dispatch and analyzeResumesBulk when multiple files are dropped", async () => {
    const files = [
      new File(["resume1"], "resume1.pdf", { type: "application/pdf" }),
      new File(["resume2"], "resume2.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }),
    ];

    (analyzeResumesBulk as unknown as jest.Mock).mockReturnValue({
      unwrap: () => Promise.resolve(),
    });

    setup();

    const dropzone = screen.getByText(/Upload Resume Files/i).parentElement!;
    fireEvent.drop(dropzone, {
      dataTransfer: { files },
    });

    await waitFor(() => {
      expect(analyzeResumesBulk).toHaveBeenCalledWith({
        requisitionId: 123,
        files,
      });
    });
  });

  it("shows upload progress if available", () => {
    (useAppSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        resumes: {
          uploadProgress: [
            { fileName: "resume.pdf", progress: 50, status: "uploading" },
          ],
        },
        resumeAnalysis: { isLoading: false },
      })
    );

    setup();

    expect(screen.getByText(/resume.pdf/i)).toBeInTheDocument();
    expect(screen.getByText(/50%/i)).toBeInTheDocument();
  });

  it("calls clearUploadProgress and onClose when closing", () => {
    setup();

    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));

    expect(clearUploadProgress).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("disables 'Match Now' button if no files uploaded", () => {
    setup();
    const matchNowBtn = screen.getByRole("button", { name: /Match Now/i });
    expect(matchNowBtn).toBeDisabled();
  });

  it("dispatches analyzeResumeSingle when 'Match Now' clicked with 1 file", async () => {
    const mockFile = new File(["resume"], "resume.pdf", {
      type: "application/pdf",
    });

    (analyzeResumeSingle as unknown as jest.Mock).mockReturnValue({
      unwrap: () => Promise.resolve(),
    });

    setup();

    // Simulate file drop
    const dropzone = screen.getByText(/Upload Resume Files/i).parentElement!;
    fireEvent.drop(dropzone, {
      dataTransfer: { files: [mockFile] },
    });

    // Match Now button
    const matchNowBtn = await screen.findByRole("button", {
      name: /Match Now/i,
    });
    fireEvent.click(matchNowBtn);

    await waitFor(() => {
      expect(analyzeResumeSingle).toHaveBeenCalledWith({
        requisitionId: 123,
        file: mockFile,
      });
    });
  });
});
