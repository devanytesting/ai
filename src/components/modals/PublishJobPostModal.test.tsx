import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PublishJobPostModal } from "./PublishJobPostModal";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { publishJobPost, JobPost } from "../../features/jobPosts/jobPostsSlice";
import { useToast } from "../../hooks/use-toast";

// Mock redux hooks and slice actions
jest.mock("../../hooks/redux", () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock("../../features/jobPosts/jobPostsSlice", () => ({
  publishJobPost: jest.fn(),
}));

jest.mock("../../hooks/use-toast", () => ({
  useToast: jest.fn(),
}));

describe("PublishJobPostModal", () => {
  const mockDispatch = jest.fn();
  const mockToast = jest.fn();
  const mockOnClose = jest.fn();

  // ✅ Full mock jobPost object satisfying JobPost type
  const jobPost: JobPost = {
    id: 1,
    requisition_id: 100,
    title: "Software Engineer",
    description: "Build and maintain software systems",
    location: "Remote",
    experience_required: 2,
    skills_required: ["React", "Node.js"],
    salary_range_min: 50000,
    salary_range_max: 100000,
    employment_type: "Full-time",
    created_at: "2025-09-18T10:00:00Z",
    status: "draft", // or another valid status
    published_portals: [],
    external_job_ids: {},
    created_by: 1,
    published_at: "2025-09-19T10:00:00Z", // mock value
    expires_at: "2025-12-31T23:59:59Z",   // mock value
    // Add any other required fields with mock values
  };

  beforeEach(() => {
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useAppSelector as jest.Mock).mockImplementation((fn) =>
      fn({ jobPosts: { isLoading: false } })
    );
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });

    jest.clearAllMocks();
  });

  const renderModal = (props = {}) =>
    render(
      <PublishJobPostModal
        jobPost={jobPost}
        isOpen={true}
        onClose={mockOnClose}
        {...props}
      />
    );

  it("renders job details when jobPost is provided", () => {
    renderModal();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("Remote")).toBeInTheDocument();
  });

  it("toggles portal selection", () => {
    renderModal();

    const linkedinCheckbox = screen.getByLabelText(/LinkedIn/i);
    expect(linkedinCheckbox).not.toBeChecked();

    fireEvent.click(linkedinCheckbox);
    expect(linkedinCheckbox).toBeChecked();

    fireEvent.click(linkedinCheckbox);
    expect(linkedinCheckbox).not.toBeChecked();
  });

  it("shows Ready to Publish box when portals are selected", () => {
    renderModal();
    fireEvent.click(screen.getByLabelText(/Indeed/i));

    expect(screen.getByText(/Ready to Publish/i)).toBeInTheDocument();
    expect(screen.getByText(/Indeed/i)).toBeInTheDocument();
  });

  it("dispatches publishJobPost and shows success toast", async () => {
    const mockUnwrap = jest.fn().mockResolvedValue({});
    mockDispatch.mockReturnValue({ unwrap: mockUnwrap });

    renderModal();

    fireEvent.click(screen.getByLabelText(/Glassdoor/i));
    fireEvent.click(screen.getByText(/Publish to 1 Portal/i));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        publishJobPost({
          jobPostId: 1,
          publishData: { portals: ["glassdoor"] },
        })
      );
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Success",
          description: expect.stringContaining("1 portal"),
        })
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("shows error toast if publish fails", async () => {
    const mockUnwrap = jest.fn().mockRejectedValue(new Error("fail"));
    mockDispatch.mockReturnValue({ unwrap: mockUnwrap });

    renderModal();

    fireEvent.click(screen.getByLabelText(/Monster/i));
    fireEvent.click(screen.getByText(/Publish to 1 Portal/i));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Error",
          description: expect.stringContaining("Failed"),
          variant: "destructive",
        })
      );
    });
  });

  it("calls onClose and clears selection when Cancel is clicked", () => {
    renderModal();

    fireEvent.click(screen.getByLabelText(/ZipRecruiter/i));
    fireEvent.click(screen.getByText(/Cancel/i));

    expect(mockOnClose).toHaveBeenCalled();
  });
});
