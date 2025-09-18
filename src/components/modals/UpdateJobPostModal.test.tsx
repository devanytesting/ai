// __tests__/UpdateJobPostModal.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { UpdateJobPostModal } from "./UpdateJobPostModal";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { updateJobPost, clearError, JobPost } from "../../features/jobPosts/jobPostsSlice";
import { toast } from "sonner";

// Mock hooks & Redux
jest.mock("../../hooks/redux", () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock("../../features/jobPosts/jobPostsSlice", () => ({
  updateJobPost: jest.fn(),
  clearError: jest.fn(),
}));

// Mock toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const jobPost: JobPost = {
    id: 1,
    title: "Frontend Developer",
    description: "Build UI components",
    location: "Remote",
    experience_required: 2,
    skills_required: ["React", "TypeScript"],
    salary_range_min: 50000,
    salary_range_max: 100000,
    employment_type: "Full-time",
    status: "published",
    created_at: "2025-09-18T00:00:00Z",
    expires_at: "2025-12-31T23:59:59Z",
    requisition_id: 123,
    published_portals: [],
    external_job_ids: [],
    created_by: 1,
    published_at: "2025-09-18T00:00:00Z",
};

describe("UpdateJobPostModal", () => {
    const mockDispatch = jest.fn();
    const mockOnClose = jest.fn();

    beforeEach(() => {
        (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
        // Return the correct shape for useAppSelector
        (useAppSelector as jest.Mock).mockImplementation((selector) =>
            selector({ jobPosts: { isLoading: false, error: null } })
        );
        jest.clearAllMocks();
    });

    it("renders with job post data", () => {
        render(
            <UpdateJobPostModal isOpen={true} onClose={mockOnClose} jobPost={jobPost} />
        );
        expect(screen.getByDisplayValue("Frontend Developer")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Remote")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Build UI components")).toBeInTheDocument();
        expect(screen.getByDisplayValue("2")).toBeInTheDocument();
        expect(screen.getByDisplayValue("50000")).toBeInTheDocument();
        expect(screen.getByDisplayValue("100000")).toBeInTheDocument();
        expect(screen.getByDisplayValue("React, TypeScript")).toBeInTheDocument();
    });

    it("updates input fields", () => {
        render(
            <UpdateJobPostModal isOpen={true} onClose={mockOnClose} jobPost={jobPost} />
        );
        // Use getByDisplayValue to find the input, then change it
        const titleInput = screen.getByDisplayValue("Frontend Developer");
        fireEvent.change(titleInput, { target: { value: "Backend Developer" } });
        expect(titleInput).toHaveValue("Backend Developer");

        const locationInput = screen.getByDisplayValue("Remote");
        fireEvent.change(locationInput, { target: { value: "New York" } });
        expect(locationInput).toHaveValue("New York");
    });

    it("dispatches updateJobPost on submit success", async () => {
        const mockUnwrap = jest.fn().mockResolvedValue({});
        ((updateJobPost as unknown) as jest.Mock).mockReturnValue({ unwrap: mockUnwrap });

        render(
            <UpdateJobPostModal isOpen={true} onClose={mockOnClose} jobPost={jobPost} />
        );

        // Find the submit button by text or role
        const submitBtn = screen.getByRole("button", { name: /Update Job Post/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(updateJobPost).toHaveBeenCalledWith({
                jobPostId: 1,
                jobPostData: expect.any(Object),
            });
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it("shows error toast on submit failure", async () => {
        const mockUnwrap = jest.fn().mockRejectedValue("Update failed");
        ((updateJobPost as unknown) as jest.Mock).mockReturnValue({ unwrap: mockUnwrap });

        render(
            <UpdateJobPostModal isOpen={true} onClose={mockOnClose} jobPost={jobPost} />
        );

        const submitBtn = screen.getByRole("button", { name: /Update Job Post/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                "Failed to update job post",
                { description: "Update failed" }
            );
        });
    });

    it("calls clearError and onClose when closing", () => {
        render(
            <UpdateJobPostModal isOpen={true} onClose={mockOnClose} jobPost={jobPost} />
        );
        // Find the cancel button by text or role
        const cancelBtn = screen.getByRole("button", { name: /Cancel/i });
        fireEvent.click(cancelBtn);

        expect(clearError).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
    });
});

