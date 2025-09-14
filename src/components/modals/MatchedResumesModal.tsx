import React, { useEffect } from 'react';
import { FileText, Download, Eye, X, Star } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchMatchedResumes } from '../../features/resumes/resumesSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';

interface MatchedResumesModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
}

export const MatchedResumesModal: React.FC<MatchedResumesModalProps> = ({
  isOpen,
  onClose,
  jobId,
}) => {
  const dispatch = useAppDispatch();
  const { matchedResumes, isLoading } = useAppSelector((state) => state.resumes);

  useEffect(() => {
    if (isOpen && jobId) {
      dispatch(fetchMatchedResumes(jobId));
    }
  }, [isOpen, jobId, dispatch]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getMatchScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'outline';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <span>Matched Resumes</span>
           
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-2"></div>
                <p className="text-muted-foreground">Loading matched resumes...</p>
              </div>
            </div>
          ) : matchedResumes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Matched Resumes</h3>
              <p className="text-muted-foreground">
                No resumes have been uploaded or matched for this job yet.
              </p>
            </div>
          ) : (
            <>
              <div className="text-sm text-muted-foreground mb-4">
                Found {matchedResumes.length} matched resume{matchedResumes.length !== 1 ? 's' : ''}
              </div>
              
              <div className="max-h-96 overflow-y-auto space-y-3">
                {matchedResumes.map((resume) => (
                  <Card key={resume.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <FileText className="w-8 h-8 text-muted-foreground flex-shrink-0" />
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{resume.fileName}</h4>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>{formatFileSize(resume.fileSize)}</span>
                              <span>{formatDate(resume.uploadDate)}</span>
                              <span className="capitalize">{resume.status}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          {resume.matchScore !== undefined && (
                            <div className="text-center">
                              <div className={`flex items-center space-x-1 ${getMatchScoreColor(resume.matchScore)}`}>
                                <Star className="w-4 h-4" />
                                <span className="font-medium">{resume.matchScore}%</span>
                              </div>
                              <Badge 
                                variant={getMatchScoreBadgeVariant(resume.matchScore)}
                                className="text-xs mt-1"
                              >
                                {resume.matchScore >= 80 ? 'Excellent' : 
                                 resume.matchScore >= 60 ? 'Good' : 'Fair'} Match
                              </Badge>
                            </div>
                          )}

                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {matchedResumes.length > 0 && (
              <Button>
                Export List
              </Button>
            )}
          </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};