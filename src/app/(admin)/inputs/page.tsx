import CuttingContainer from '../../../modules/input/CuttingContainer';
import SewingContainer from '../../../modules/input/SewingContainer';
import RibContainer from '../../../modules/input/RibContainer';
import { Card } from '../../../components/ui/Card';

// Admin sees all three input types with Accept/Reject controls
// (InputTable renders those actions only when isAdmin is true).
export default function AdminInputsPage() {
  return (
    <div className="grid grid-cols-1 gap-6">
      <Card><CuttingContainer /></Card>
      <Card><SewingContainer /></Card>
      <Card><RibContainer /></Card>
    </div>
  );
}
