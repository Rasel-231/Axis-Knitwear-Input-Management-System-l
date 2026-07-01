import CuttingContainer from '../../../modules/input/CuttingContainer';
import SewingContainer from '../../../modules/input/SewingContainer';
import RibContainer from '../../../modules/input/RibContainer';
import { Card } from '../../../components/ui/Card';

// User can submit inputs (POST /inputs allows USER role) but InputTable
// hides Accept/Reject buttons since isAdmin is false here.
export default function UserInputsPage() {
  return (
    <div className="grid grid-cols-1 gap-6">
      <Card><CuttingContainer /></Card>
      <Card><SewingContainer /></Card>
      <Card><RibContainer /></Card>
    </div>
  );
}
