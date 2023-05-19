import { ReactNode } from 'react'
import { ToastPosition } from 'react-toastify'

/* metrics */
export interface RdbMetrics {
  currentReviewCount: number
  currentUsersCount: number
  currentRequestsCount: number
  targetReviewCount: number
  targetUsersCount: number
  targetRequestsCount: number
}
export interface MetricsObject {
  totalReviews: string;
  totalUsers: string;
  totalRequests: string;
}
export interface MetricsDisplayProps {
  reviewCount: number
  userCount: number
  requestsCount: number
}

/* getting rdb user info */
export interface Badge {
  name: string;
  icon: string;
  redirectURL: string;
  type: number;
  description: string;
}
export interface GetUser {
  ID: number;
  discordID: string;
  username: string;
  profilePhoto: string;
  clientMods: string[];
  warningCount: number;
  badges: Badge[];
  banInfo: null | Date;
  lastReviewID: number;
  type: number;
}

/* getting reviews */
export interface Sender {
  id: number;
  discordID: string;
  username: string;
  profilePhoto: string;
  badges: Badge[];
}

export interface Review {
  id: number;
  sender: Sender;
  comment: string;
  type: number;
  timestamp: number;
  query?: string; // not part of the api response, added when needed
}
export interface GetReviews {
  success: boolean;
  message: string;
  reviews: Review[];
}

/* adding reviews */
export interface AddReview {
  success: boolean;
  message: string;
  updated: boolean;
}

/* deleting reviews */
export interface DeleteReview {
  success: boolean;
  message: string;
}

/* reporting reviews */
export interface ReportReview {
  success: boolean;
  message: string;
}

/* dashboard input value props */
export interface InputValueState {
  inputValue: string
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void // eslint-disable-line no-unused-vars
}

/* dashboard handleClick props */
export interface HandleClickProps {
  eventOrQuery?: React.MouseEvent | string;
  admin: number | undefined;
  inputValue: string;
  setReviews: (reviews: JSX.Element[]) => void; // eslint-disable-line no-unused-vars
  setLoading?: (loading: boolean) => void; // eslint-disable-line no-unused-vars
}

/* toggle props */
export interface ToggleProps {
  checked?: boolean;
  onChange?: (isChecked: boolean) => void; // eslint-disable-line no-unused-vars
  label?: string;
  className?: string;
}

/* review card props */
export interface ReviewCardProps {
  review: Review;
  handleReportReviewClick: (reviewId: number) => void; // eslint-disable-line no-unused-vars
  handleDeleteReviewClick: (reviewId: number, discordId: string) => void; // eslint-disable-line no-unused-vars
  isAdmin: number | undefined;
}
export interface ReviewDialogContentProps extends ReviewCardProps {
  closeDialog: () => void;
}

/* notify props */
export interface ToastOptions {
  type?: 'info' | 'success' | 'warning' | 'error';
  message?: string;
  position?: ToastPosition;
  autoClose?: number | false;
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  progress?: number | undefined;
  theme?: 'dark' | 'light' | 'colored';
}

/* dialog props */
export interface DialogProps {
  content: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}
export interface UseDialog {
  isOpen: boolean;
  content: React.ReactNode;
  openDialog: (content: React.ReactNode) => void; // eslint-disable-line no-unused-vars
  closeDialog: () => void;
}

/* cookie func props */
export interface SetCookieItemParams {
  key: string;
  value: string;
}

export interface GetCookieItemParams {
  key: string;
  defaultValue?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

/* rdb user settings */
export interface Settings {
  DiscordID: string | null;
  opt: boolean;
}
