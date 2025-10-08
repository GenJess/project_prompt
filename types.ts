export interface SelectedFile {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
  width: number;
  height: number;
}

export interface PromptAnalysisItem {
  parameter: string;
  target_phrase: string;
  user_phrase: string;
  feedback: string;
}

export interface ScoreAndFeedbackResponse {
  score: number;
  analysis: PromptAnalysisItem[];
}
