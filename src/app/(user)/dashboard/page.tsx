import DashboardContainer from '../../../modules/dashboard/DashboardContainer';

// Same container as Admin — read-only is enforced by the backend route
// (/dashboard only has GET) and by the absence of action buttons in
// WipSummaryTable, not by a separate component.
export default function UserDashboardPage() {
  return <DashboardContainer />;
}
